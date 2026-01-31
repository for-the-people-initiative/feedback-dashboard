export default defineEventHandler(async (event) => {
  verifyAdmin(event);
  const db = useTurso();
  const result = await db.execute('SELECT DISTINCT app FROM feedback WHERE app IS NOT NULL AND app != \'\' ORDER BY app');
  return result.rows.map((row: any) => row.app as string);
});
