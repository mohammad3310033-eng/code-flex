import { spawn } from "node:child_process";
import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const CACHE_FILE_NAME = ".admin-credentials.enc";

const protectScript = [
  "$ErrorActionPreference = 'Stop'",
  "Import-Module Microsoft.PowerShell.Security -ErrorAction Stop",
  "$encoded = [Console]::In.ReadToEnd().Trim()",
  "$plain = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded))",
  "$secure = ConvertTo-SecureString -String $plain -AsPlainText -Force",
  "[Console]::Out.Write((ConvertFrom-SecureString -SecureString $secure))",
].join("; ");

const unprotectScript = [
  "$ErrorActionPreference = 'Stop'",
  "Import-Module Microsoft.PowerShell.Security -ErrorAction Stop",
  "$encrypted = [Console]::In.ReadToEnd().Trim()",
  "$secure = ConvertTo-SecureString -String $encrypted",
  "$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)",
  "try { $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer); [Console]::Out.Write([Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($plain))) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }",
].join("; ");

function cacheWarning(operation) {
  return `Windows DPAPI ${operation} failed; secure local credential caching was skipped.`;
}

function runPowerShell(script, input) {
  return new Promise((resolve, reject) => {
    const systemRoot = process.env.SystemRoot || "C:\\Windows";
    const environment = {
      ...process.env,
      PSModulePath: path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "Modules"),
    };
    const child = spawn("powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script], {
      stdio: ["pipe", "pipe", "ignore"],
      windowsHide: true,
      env: environment,
    });
    const output = [];
    child.stdout.on("data", (chunk) => output.push(chunk));
    child.on("error", () => reject(new Error("PowerShell could not start")));
    child.on("close", (code) => code === 0 ? resolve(Buffer.concat(output).toString("utf8").trim()) : reject(new Error("PowerShell exited unsuccessfully")));
    child.stdin.end(input, "utf8");
  });
}

export function credentialCachePath(root) {
  return path.join(root, "artifacts", "verification", CACHE_FILE_NAME);
}

export async function savedCredentialsStatus(root) {
  try {
    await access(credentialCachePath(root));
    return true;
  } catch {
    return false;
  }
}

export async function loadSavedCredentials(root) {
  if (process.platform !== "win32") return { credentials: undefined, warning: "Windows DPAPI credential caching is unavailable on this platform." };
  try {
    const encrypted = await readFile(credentialCachePath(root), "utf8");
    if (!encrypted.trim()) throw new Error("cache is empty");
    const encoded = await runPowerShell(unprotectScript, encrypted);
    const value = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
    const email = typeof value.email === "string" ? value.email.trim() : "";
    const password = typeof value.password === "string" ? value.password : "";
    if (!email || !password) throw new Error("cache payload is invalid");
    return { credentials: { email, password } };
  } catch (error) {
    if (error?.code === "ENOENT") return { credentials: undefined };
    return { credentials: undefined, warning: cacheWarning("decryption") };
  }
}

export async function saveCredentialsAfterAuthentication(root, credentials) {
  if (process.platform !== "win32") return { saved: false, warning: "Windows DPAPI credential caching is unavailable on this platform." };
  try {
    const payload = Buffer.from(JSON.stringify({ email: credentials.email.trim(), password: credentials.password }), "utf8").toString("base64");
    const encrypted = await runPowerShell(protectScript, payload);
    if (!encrypted) throw new Error("encryption produced no output");
    const destination = credentialCachePath(root);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, `${encrypted}\n`, { encoding: "utf8", mode: 0o600 });
    return { saved: true };
  } catch {
    return { saved: false, warning: cacheWarning("encryption") };
  }
}

export async function clearSavedCredentials(root) {
  try {
    await unlink(credentialCachePath(root));
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw new Error("Unable to clear the secure local credential cache.");
  }
}

export async function resolveVerifierCredentials({
  environment,
  interactive,
  askEmail,
  askPassword,
  rootDirectory,
  loadCache = loadSavedCredentials,
  notify = console.log,
}) {
  let email = environment.TEST_ADMIN_EMAIL?.trim();
  let password = environment.TEST_ADMIN_PASSWORD;
  if (email && password) return { credentials: { email, password }, source: "environment" };

  if (!email && !password) {
    const cached = await loadCache(rootDirectory);
    if (cached.credentials) {
      notify("Admin credentials: loaded from secure local cache");
      return { credentials: cached.credentials, source: "secure-cache" };
    }
    if (cached.warning) notify(`Warning: ${cached.warning}`);
  }
  if (!email && interactive) email = await askEmail("Admin email: ");
  if (!password && interactive) password = await askPassword("Admin password (hidden): ");
  return email && password ? { credentials: { email, password }, source: "interactive" } : { credentials: undefined, source: "unavailable" };
}

export async function persistInteractiveCredentialsAfterAuthentication({
  authenticated,
  source,
  rootDirectory,
  credentials,
  saveCache = saveCredentialsAfterAuthentication,
}) {
  if (!authenticated || source !== "interactive" || !credentials) return { saved: false };
  return saveCache(rootDirectory, credentials);
}
