export default defineEventHandler(async (event) => {
  verifyAdmin(event);
  const id = getRouterParam(event, 'id');
  const db = useTurso();

  const result = await db.execute({
    sql: 'SELECT * FROM feedback WHERE id = ?',
    args: [id!],
  });

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Feedback niet gevonden' });
  }

  return result.rows[0];
});
