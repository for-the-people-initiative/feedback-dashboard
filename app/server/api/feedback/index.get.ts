export default defineEventHandler(async (event) => {
  verifyAdmin(event);
  const query = getQuery(event);

  const status = query.status as string | undefined;
  const type = query.type as string | undefined;
  const app = query.app as string | undefined;
  const search = query.search as string | undefined;
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 20;
  const sort = (query.sort as string) || 'created_at';
  const order = (query.order as string) === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (app) {
    conditions.push('app = ?');
    params.push(app);
  }
  if (search) {
    conditions.push('(title LIKE ? OR body LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const allowedSorts = ['created_at', 'updated_at', 'type', 'status'];
  const safeSort = allowedSorts.includes(sort) ? sort : 'created_at';

  const db = useTurso();

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM feedback ${where}`,
    args: params,
  });
  const total = Number(countResult.rows[0]?.total ?? 0);

  const result = await db.execute({
    sql: `SELECT * FROM feedback ${where} ORDER BY ${safeSort} ${order} LIMIT ? OFFSET ?`,
    args: [...params, limit, offset],
  });

  return {
    items: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
});
