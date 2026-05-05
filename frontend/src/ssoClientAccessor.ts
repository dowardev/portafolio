import type { SSOClient } from "@tu-org/sso-client";

let _ssoClient: SSOClient | undefined;

export function setSSOClient(client: SSOClient): void {
  _ssoClient = client;
}

export function getSSOClient(): SSOClient {
  if (!_ssoClient) {
    throw new Error("SSOClient not initialized. Ensure main.ts has run first.");
  }
  return _ssoClient;
}
