import { APIError } from '../middleware/errors.js';
import * as ProfileModel from '../models/profile.model.js';

export const getById = async id => {
  const profile = await ProfileModel.getById(id);
  if (!profile) {
    throw new APIError('user not found', 404);
  }
  return profile;
};

export const updateProfile = async (userId, fields) => {
  const updated = await ProfileModel.update(userId, fields);
  if (!updated) {
    throw new APIError('user not found', 404);
  }
  return updated;
};
