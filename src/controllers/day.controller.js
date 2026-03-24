import * as dayService from '../services/day.service.js';
import * as milestoneService from '../services/milestone.service.js';
import * as summaryService from '../services/summary.service.js';
import { ApiError } from '../utils/ApiError.js';
import { getUrl } from '../utils/storage.js';
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

    let summary;

    if (day['day_number'] % 7 === 0) {
      const week = day['day_number'] / 7;
      summary = await summaryService.find(req.user.id, week);
    }

    res.status(200).json({
      day: {
        day_number: day.day_number,
        diet_adhered: day.diet_adhered,
        outdoor_workout_completed: day.outdoor_workout_completed,
        indoor_workout_completed: day.indoor_workout_completed,
        water_consumed: day.water_consumed,
        pages_read: day.pages_read,
        mood_rating: day.mood_rating,
        achievements: day.achievements,
        challenges: day.challenges,
        next_day_focus: day.next_day_focus,
        progress_pic_url: await getUrl(day.progress_pic_key),
        created_at: day.created_at
      },
      weekly_summary: summary
    });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const days = await dayService.findAll(req.user.id);
    const summaries = await summaryService.findAll(req.user.id);
    for (const idx in days) {
      const day = days[idx];
      days[idx] = {
        day_number: day.day_number,
        diet_adhered: day.diet_adhered,
        outdoor_workout_completed: day.outdoor_workout_completed,
        indoor_workout_completed: day.indoor_workout_completed,
        water_consumed: day.water_consumed,
        pages_read: day.pages_read,
        mood_rating: day.mood_rating,
        achievements: day.achievements,
        challenges: day.challenges,
        next_day_focus: day.next_day_focus,
        progress_pic_url: await getUrl(day.progress_pic_key),
        created_at: day.created_at
      };
    }
    res.status(200).json({
      days,
      summaries
    });
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

    return res.status(201).json({
      day: {
        day_number: newDay.day_number,
        diet_adhered: newDay.diet_adhered,
        outdoor_workout_completed: newDay.outdoor_workout_completed,
        indoor_workout_completed: newDay.indoor_workout_completed,
        water_consumed: newDay.water_consumed,
        pages_read: newDay.pages_read,
        mood_rating: newDay.mood_rating,
        achievements: newDay.achievements,
        challenges: newDay.challenges,
        next_day_focus: newDay.next_day_focus,
        progress_pic_url: await getUrl(newDay.progress_pic_key),
        created_at: day.created_at
      },
      weekly_summary: summary
    });
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
