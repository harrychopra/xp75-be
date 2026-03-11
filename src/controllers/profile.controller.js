import * as ProfileService from '../services/profile.service.js';

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await ProfileService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
