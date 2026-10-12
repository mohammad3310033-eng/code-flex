param(
  [string]$Target = $env:TEST_BASE_URL
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

if ($Target) {
  $env:TEST_BASE_URL = $Target
}

$PromptedEmail = $false
$PromptedPassword = $false
if ($Target -and -not $env:ADMIN_EMAIL) {
  $env:ADMIN_EMAIL = Read-Host "Admin email"
  $PromptedEmail = $true
}
if ($Target -and -not $env:ADMIN_PASSWORD) {
  $SecurePassword = Read-Host "Admin password" -AsSecureString
  $PasswordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
  try {
    $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($PasswordPointer)
    $PromptedPassword = $true
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($PasswordPointer)
  }
}

Push-Location $ProjectRoot
try {
  node scripts/verify-admin-product-ux.mjs
  exit $LASTEXITCODE
}
finally {
  Pop-Location
  if ($PromptedEmail) { Remove-Item Env:ADMIN_EMAIL -ErrorAction SilentlyContinue }
  if ($PromptedPassword) { Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue }
}
