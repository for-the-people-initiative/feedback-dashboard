export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);
  const config = useRuntimeConfig();

  if (password !== config.adminPassword) {
    throw createError({ statusCode: 401, message: 'Ongeldig wachtwoord' });
  }

  setCookie(event, 'admin_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return { success: true };
});
