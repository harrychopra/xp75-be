import { APIError } from '../middleware/errors.js';
import * as ProfileModel from '../models/profile.model.js';

export const updateProfile = async (userId, fields) => {
  const updated = await ProfileModel.update(userId, fields);
  if (!updated) {
    throw new APIError('Profile not found', 404);
  }
  return updated;
};
