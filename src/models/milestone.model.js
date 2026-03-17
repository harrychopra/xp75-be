import db from '../../db/connection.js';

export async function insert(user_id, badge_type) {
  const { rows } = await db.query(
    `INSERT INTO milestones (user_id, badge_type) values ($1, $2) returning *`,
    [user_id, badge_type]
  );

  return rows[0] || null;
}

export async function findAll(user_id) {
  const { rows } = await db.query(
    `SELECT badge_type, awarded_at FROM milestones WHERE user_id = $1`,
    [user_id]
  );

  return rows;
}
