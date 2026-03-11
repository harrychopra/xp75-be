import { APIError } from '../middleware/errors.js';
import * as DayModel from '../models/day.model.js';

export const startDay = async (profileId, dayNumber, currentlyReadingId) => {
  if (dayNumber < 1 || dayNumber > 75) {
    throw new APIError('day_number must be between 1 and 75', 400);
  }

  const existing = await DayModel.getByProfileAndNumber(profileId, dayNumber);
  if (existing) {
    throw new APIError('day already started', 409);
  }

  return DayModel.create(profileId, dayNumber, currentlyReadingId);
};
