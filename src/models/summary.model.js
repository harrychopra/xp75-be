import db from '../../db/connection.js';

export async function findAll(userId) {
  const { rows } = await db.query(
    `SELECT
      user_id, week, summary, created_at
    FROM
      weekly_summaries
    WHERE
      user_id = $1
    ORDER BY
     week
    ASC`,
    [userId]
  );
  return rows;
}

export async function create(user_id, weekNumber, summaryText) {
  const result = await db.query(
    `INSERT INTO weekly_summaries (user_id, week, summary) values ($1, $2, $3)`,
    [user_id, weekNumber, summaryText]
  );
  if (result.rowCount !== 1) throw new Error('Failed to insert weekly summary');
}
