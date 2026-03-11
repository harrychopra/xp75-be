import * as DaysService from '../services/day.service.js';

export const startDay = async (req, res, next) => {
  try {
    const { day_number, currently_reading } = req.body;
    if (!day_number) {
      return res.status(400).json({ error: 'day_number is required' });
    }

    const day = await DaysService.startDay(
      req.user.id,
      day_number,
      currently_reading || null
    );
    res.status(201).json(day);
  } catch (err) {
    next(err);
  }
};
