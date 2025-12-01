import JsCookie from "js-cookie";
import { ACCESS_TOKEN_KEY, API_URL } from "./constants";
import { Agent } from "@/types/agents";

export const getCookie = async (name: string): Promise<string | undefined> => {
  if (typeof document === "undefined") {
    return import("next/headers").then(async ({ cookies }) => {
      return (await cookies()).get(name)?.value;
    });
  } else return JsCookie.get(name);
};

export const setCookie = async (
  name: string,
  value: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
): Promise<void> => {
  if (typeof document === "undefined") {
    import("next/headers").then(async ({ cookies }) => {
      (await cookies()).set(name, value, params);
    });
  } else JsCookie.set(name, value, params);
};

export const refreshToken = async (): Promise<string | null> => {
  const auth = await getCookie("refresh_token");
  const url = new URL(API_URL + "/auth/token");

  const token = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `refresh_token=${auth}`,
    },
  });

  if (token.ok) {
    const data = await token.json();

    return data.accessToken;
  }

  if (token.status === 403) {
    window.location.href = "/logout";

    return Promise.reject(new Error("Unauthorized"));
  }

  return null;
};

interface APIResponse {
  success: boolean;
  data: {
    total_records: number;
    current_page: number;
    total_pages: number;
    data: Agent[];
  };
}

export const fetchAgentsData = async ({
  params,
}: {
  params: {
    searchTerm?: string;
    limit: number;
    page?: number;
    offset?: number;
    orderBy?: string;
    direction?: string;
  };
}) => {
  const url = new URL(API_URL + "/dashboard");

  type ParamKeys = keyof typeof params;
  Object.keys(params).forEach((queryParam) => {
    const value = params[queryParam as ParamKeys];
    if (value) {
      url.searchParams.append(queryParam, `${value}`);
    }
  });

  const data_source = await apiFetch<APIResponse>(url.toString());

  return data_source.data;
};

export type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  token?: string;
};

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {},
  retry = true
): Promise<T> {
  const { headers = {}, token: optionToken, ...restOptions } = options;
  const token = optionToken || (await getCookie(ACCESS_TOKEN_KEY)) || "";

  const response = await fetch(new URL(url, API_URL).toString(), {
    credentials: "include",
    ...restOptions,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 403) {
    // redirect to logout
    window.location.href = "/logout";

    return Promise.reject(new Error("Unauthorized"));
  }

  if (response.status === 401 && retry) {
    const tokenResponse = (await refreshToken()) || "";

    return apiFetch(url, { ...options, token: tokenResponse }, false);
  }

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  // Adjust if your API sometimes returns no JSON
  return response.json() as Promise<T>;
}
