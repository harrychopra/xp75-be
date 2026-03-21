import * as dayService from '../services/day.service.js';
import * as milestoneService from '../services/milestone.service.js';
import * as summaryService from '../services/summary.service.js';
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
    const summaries = await summaryService.findAll(req.user.id);
    res.status(200).json({ days, summaries });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError('Progress pic is required', 400);
    }

    const day = {
      user_id: req.user.id,
      day_number: Number(req.body.day_number),
      diet_adhered: Boolean(req.body.diet_adhered),
      outdoor_workout_completed: Boolean(req.body.outdoor_workout_completed),
      indoor_workout_completed: Boolean(req.body.indoor_workout_completed),
      water_consumed: Boolean(req.body.water_consumed),
      pages_read: Boolean(req.body.pages_read),
      mood_rating: Number(req.body.mood_rating),
      achievements: req.body.achievements,
      challenges: req.body.challenges,
      next_day_focus: req.body.next_day_focus
    };

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
    ], day);

    const newDay = await dayService.create(day, req.file);
    await milestoneService.awardBadgeIfEligible(newDay);

    let summary;

    if (newDay['day_number'] % 7 === 0) {
      const week = newDay['day_number'] / 7;
      summary = await summaryService.create(req.user.id, week);
    }

    return res.status(201).json({ day: newDay, weekly_summary: summary });
  } catch (err) {
    if (err.code === '23505') {
      next(new ApiError('day_number already exists', 400));
    } else {
      next(err);
    }
  }
}

export async function remove(req, res, next) {
  try {
    const { day_number } = req.params;
    validateDayNumber(day_number);
    await dayService.remove(req.user.id, day_number);

    if (day_number % 25 === 0) {
      await milestoneService.remove(req.user.id, day_number);
    }

    if (day_number % 7 === 0) {
      await summaryService.remove(req.user.id, day_number);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
