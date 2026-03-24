import db from '../../db/connection.js';

export async function find(userId, week) {
  const { rows } = await db.query(
    `SELECT
      week, summary
    FROM
      weekly_summaries
    WHERE
      user_id = $1 AND week = $2
    ORDER BY
     week
    ASC`,
    [userId, week]
  );
  return rows[0] || null;
}
export async function findAll(userId) {
  const { rows } = await db.query(
    `SELECT
      week, summary
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
  const { rows } = await db.query(
    `INSERT INTO weekly_summaries (user_id, week, summary) values ($1, $2, $3) returning week, summary`,
    [user_id, weekNumber, summaryText]
  );
  return rows[0] || null;
}

export async function remove(userId, week) {
  const result = await db.query(
    `DELETE FROM weekly_summaries WHERE user_id = $1 AND week = $2`,
    [userId, week]
  );

  if (result.rowCount !== 1) {
    throw new Error('Failed to delete summary record');
  }
}
