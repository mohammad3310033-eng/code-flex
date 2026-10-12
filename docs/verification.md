# Release verification

Every major feature ships with an executable acceptance verifier. The normal release gate is:

```powershell
npm run verify:release
```

It runs static checks, then uses a fresh headless Playwright browser against `https://code-flex-orcin.vercel.app` (or `TEST_BASE_URL`). It never uses a visible browser, CDP, saved profiles, or stored credentials. `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASSWORD` may be supplied through the PowerShell environment; missing interactive values are prompted, with the password masked.

The result is `PASS`, `FAIL`, or `BLOCKED`. `BLOCKED` means the behavior could not safely be executed, not that it passed. The sanitized latest report is written to `artifacts/verification/release-latest.json`.

Production mutations are disabled by default. To run the guarded settings and temporary-order checks, explicitly opt in:

```powershell
$env:RUN_RELEASE_MUTATION_TESTS = 'YES_I_UNDERSTAND'
npm run verify:release
```

The verifier restores the original settings value and cleans only the exact temporary order and analytics IDs it created. Cloudinary is deliberately excluded until a dedicated `verify:cloudinary` verifier exists.

For each future major feature, implement or update a predictably named verifier (for example `verify:products`, `verify:settings`, or `verify:analytics`), run local/static checks, deploy, then run its Production acceptance verifier. `PASS` closes the phase; `FAIL` is fixed in the same phase; `BLOCKED` needs an explicit decision.
