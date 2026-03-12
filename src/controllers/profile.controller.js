import { APIError } from '../middleware/errors.js';
import * as ProfileService from '../services/profile.service.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await ProfileService.getById(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (req.body === undefined) {
      throw new APIError('profile update request cannot be empty', 400);
    }
    const updated = await ProfileService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
