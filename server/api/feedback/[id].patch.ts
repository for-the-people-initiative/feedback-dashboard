export default defineEventHandler(async (event) => {
  verifyAdmin(event);
  const id = getRouterParam(event, 'id');
  const { status } = await readBody(event);
  const db = useTurso();

  await db.execute({
    sql: "UPDATE feedback SET status = ?, updated_at = datetime('now') WHERE id = ?",
    args: [status, id!],
  });

  const result = await db.execute({
    sql: 'SELECT * FROM feedback WHERE id = ?',
    args: [id!],
  });

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Feedback niet gevonden' });
  }

  return result.rows[0];
});
