import { createClient, type Client } from '@libsql/client';

let _client: Client | null = null;

export function useTurso(): Client {
  if (!_client) {
    const config = useRuntimeConfig();
    _client = createClient({
      url: config.tursoUrl,
      authToken: config.tursoToken,
    });
  }
  return _client;
}
