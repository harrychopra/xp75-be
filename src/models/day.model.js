import db from '../../db/connection.js';

export async function find(userId, dayNumber) {
  const { rows } = await db.query(
    `SELECT
      user_id, day_number, diet_adhered, outdoor_workout_completed, indoor_workout_completed,
      water_consumed, pages_read, mood_rating, achievements, challenges, next_day_focus,
      progress_pic_key, created_at
    FROM
      days
    WHERE
      user_id = $1
    AND
      day_number = $2`,
    [userId, dayNumber]
  );
  return rows[0] || null;
}

export async function findAll(userId) {
  const { rows } = await db.query(
    `SELECT
      user_id, day_number, diet_adhered, outdoor_workout_completed, indoor_workout_completed,
      water_consumed, pages_read, mood_rating, achievements, challenges, next_day_focus,
      progress_pic_key, created_at
    FROM
      days
    WHERE
      user_id = $1
    ORDER BY
      day_number
    ASC`,
    [userId]
  );
  return rows;
}

export async function insert(day) {
  const cols = Object.keys(day);
  const values = Object.values(day);
  const placeHolders = cols.map((_, idx) => `$${idx + 1}`);

  const { rows } = await db.query(
    `INSERT INTO days (${cols.join(', ')}) values (${
      placeHolders.join(', ')
    }) returning *`,
    values
  );

  return rows[0] || null;
}
