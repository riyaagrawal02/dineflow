const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const getToken = (): string | null => localStorage.getItem("auth_token");

const buildHeaders = (hasBody: boolean): Record<string, string> => {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (hasBody) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseJson = async (res: Response): Promise<any> => {
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
};

export const apiRequest = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await parseJson(res);
  if (!res.ok) {
    const message = data?.error || "Request failed";
    throw new Error(message);
  }
  return data as T;
};

export const apiGet = <T = any>(path: string): Promise<T> =>
  apiRequest<T>(path, { method: "GET", headers: buildHeaders(false) });

export const apiPost = <T = any>(path: string, body: unknown): Promise<T> =>
  apiRequest<T>(path, { method: "POST", headers: buildHeaders(true), body: JSON.stringify(body) });

export const apiPut = <T = any>(path: string, body: unknown): Promise<T> =>
  apiRequest<T>(path, { method: "PUT", headers: buildHeaders(true), body: JSON.stringify(body) });

export const apiPatch = <T = any>(path: string, body: unknown): Promise<T> =>
  apiRequest<T>(path, { method: "PATCH", headers: buildHeaders(true), body: JSON.stringify(body) });

export const apiDelete = <T = any>(path: string): Promise<T> =>
  apiRequest<T>(path, { method: "DELETE", headers: buildHeaders(false) });

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
};

export const setAuthUser = (user: unknown | null) => {
  if (user) {
    localStorage.setItem("auth_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("auth_user");
  }
};

export const getStoredUser = <T = any>(): T | null => {
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (_err) {
    return null;
  }
};
