export default defineEventHandler(async (event) => {
  verifyAdmin(event);
  const db = useTurso();

  const [totalR, byTypeR, byStatusR] = await Promise.all([
    db.execute('SELECT COUNT(*) as total FROM feedback'),
    db.execute('SELECT type, COUNT(*) as count FROM feedback GROUP BY type'),
    db.execute('SELECT status, COUNT(*) as count FROM feedback GROUP BY status'),
  ]);

  const total = Number(totalR.rows[0]?.total ?? 0);

  const byType: Record<string, number> = {};
  for (const row of byTypeR.rows) {
    byType[row.type as string] = Number(row.count);
  }

  const byStatus: Record<string, number> = {};
  for (const row of byStatusR.rows) {
    byStatus[row.status as string] = Number(row.count);
  }

  return { total, byType, byStatus };
});
