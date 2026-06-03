const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  uuid: string;
  email: string;
}

export interface ApiError {
  error: string;
}

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body: ApiError = await res.json().catch(() => ({
      error: "network error",
    }));
    throw new Error(body.error);
  }

  return res.json();
}
