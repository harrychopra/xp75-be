import * as dayService from '../services/day.service.js';
import { ApiError } from '../utils/ApiError.js';
import validate, { validateDayNumber } from '../utils/validate.js';

export async function get(req, res, next) {
  try {
    const { day_number } = req.params;
    validateDayNumber(day_number);
    const day = await dayService.find(req.user.id, day_number);
    if (!day) {
      return res.status(404).json({
        'message': `day ${day_number} does not exist`
      });
    }
    res.status(200).json(day);
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const days = await dayService.findAll(req.user.id);
    res.status(200).json(days);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    validate([
      'day_number',
      'diet_adhered',
      'outdoor_workout_completed',
      'indoor_workout_completed',
      'water_consumed',
      'pages_read',
      'mood_rating',
      'achievements',
      'challenges',
      'next_day_focus'
    ], req);

    const {
      day_number,
      diet_adhered,
      outdoor_workout_completed,
      indoor_workout_completed,
      water_consumed,
      pages_read,
      mood_rating,
      achievements,
      challenges,
      next_day_focus
    } = req.body;

    const day = {
      user_id: req.user.id,
      day_number: Number(day_number),
      diet_adhered,
      outdoor_workout_completed,
      indoor_workout_completed,
      water_consumed,
      pages_read,
      mood_rating,
      achievements,
      challenges,
      next_day_focus
    };
    const newDay = await dayService.create(day);
    res.status(201).json({ day: newDay });
  } catch (err) {
    if (err.code === '23505') {
      next(new ApiError('day_number already exists', 400));
    } else {
      next(err);
    }
  }
}
