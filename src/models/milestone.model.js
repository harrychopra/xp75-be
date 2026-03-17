import db from '../../db/connection.js';

export async function insert(user_id, badge_type) {
  const { rows } = await db.query(
    `INSERT INTO milestones (user_id, badge_type) values ($1, $2) returning *`,
    [user_id, badge_type]
  );

  return rows[0] || null;
}
