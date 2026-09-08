import { Store } from "./store";

export async function api<R>(path: string, options?: RequestInit): Promise<R> {
  const response = await fetch("/api" + path, options);
  return response.json();
}

export function apiPrivate<R>(
  path: string,
  options?: RequestInit,
  token?: string,
): Promise<R> {
  const accessToken = token ?? Store.get("accessToken");
  if (!accessToken) {
    throw new Error("Access token not found");
  }
  return api<R>(path, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
