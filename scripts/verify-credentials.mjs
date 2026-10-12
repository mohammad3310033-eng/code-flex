import path from "node:path";

import { clearSavedCredentials, savedCredentialsStatus } from "./verify/credentials.mjs";

const root = path.resolve(import.meta.dirname, "..");
const command = process.argv[2];

if (command === "status") {
  console.log(`Saved Admin credentials: ${await savedCredentialsStatus(root) ? "YES" : "NO"}`);
} else if (command === "clear") {
  await clearSavedCredentials(root);
  console.log("Saved Admin credentials: NO");
} else {
  process.exitCode = 1;
}
