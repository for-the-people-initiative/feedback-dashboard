import type { H3Event } from 'h3';

export function verifyAdmin(event: H3Event): void {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, 'admin_token');
  if (cookie !== config.adminPassword) {
    throw createError({ statusCode: 401, message: 'Niet geautoriseerd' });
  }
}
