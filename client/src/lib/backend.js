const DEFAULT_BACKEND_PROXY_PATH = "/backend";

function trimTrailingSlash(value = "") {
  return value.replace(/\/+$/, "");
}

export function getBackendBasePath() {
  return DEFAULT_BACKEND_PROXY_PATH;
}

export function getBackendAssetUrl(filepath = "") {
  if (!filepath) {
    return "";
  }

  const normalizedPath = String(filepath).replace(/^\/+/, "");
  return `${trimTrailingSlash(getBackendBasePath())}/${normalizedPath}`;
}
