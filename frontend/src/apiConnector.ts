import { HttpClient } from "@tu-org/sso-client";

let _http: HttpClient | undefined;

export function setHttpClient(http: HttpClient): void {
  _http = http;
}

export function getApiConnector(): HttpClient {
  if (!_http) {
    throw new Error("HttpClient not initialized. Ensure main.ts has run first.");
  }
  return _http;
}
