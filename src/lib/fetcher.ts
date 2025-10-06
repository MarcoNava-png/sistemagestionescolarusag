export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7169'}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {}
    const err: any = new Error(`Error en la petición: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.statusText = res.statusText;
    err.body = bodyText;
    throw err;
  }

  if (res.status === 204) {
    if (url.toLowerCase().endsWith("s")) {
      return [] as T;
    }
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
