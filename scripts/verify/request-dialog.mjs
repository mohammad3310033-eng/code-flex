const ACTION_TIMEOUT = 15_000;

export async function closeSubmittedRequestDialog(page) {
  const success = page.getByTestId("request-dialog-success");
  await success.waitFor({ state: "visible", timeout: ACTION_TIMEOUT });
  await success.getByTestId("request-dialog-close").click({ timeout: ACTION_TIMEOUT });
}
