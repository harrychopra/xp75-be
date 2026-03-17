import * as milestoneService from '../services/milestone.service.js';

export async function getAll(req, res, next) {
  try {
    const milestones = await milestoneService.findAll(req.user.id);
    res.status(200).json(milestones);
  } catch (err) {
    next(err);
  }
}
