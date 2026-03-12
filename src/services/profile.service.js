import { APIError } from '../middleware/errors.js';
import * as ProfileModel from '../models/profile.model.js';

export const getById = async id => {
  const profile = await ProfileModel.getById(id);
  if (!profile) {
    throw new APIError('user not recognized', 404);
  }
  return profile;
};

export const updateProfile = async (userId, fields) => {
  const allowed = ['username', 'name', 'avatar_url'];
  const profileData = {};

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      if (!fields[key]) throw new APIError(`${key} cannot be empty`, 400);
      profileData[key] = fields[key];
    }
  }

  const updated = await ProfileModel.update(userId, profileData);
  if (!updated) {
    throw new APIError('user not recognized', 404);
  }
  return updated;
};
