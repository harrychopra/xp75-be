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
    const updated = await ProfileService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
