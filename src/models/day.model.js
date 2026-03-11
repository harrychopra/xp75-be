import db from '../../config/db/connection.js';

export const getByProfileAndNumber = async (profileId, dayNumber) => {
  const { rows } = await db.query(
    'SELECT * FROM days WHERE profile_id = $1 AND day_number = $2',
    [profileId, dayNumber]
  );
  return rows[0] || null;
};

export const create = async (
  profileId,
  dayNumber,
  currentlyReadingId = null
) => {
  const { rows } = await db.query(
    `INSERT INTO days (profile_id, day_number, currently_reading)
     VALUES ($1, $2, $3) RETURNING *`,
    [profileId, dayNumber, currentlyReadingId]
  );
  return rows[0];
};
