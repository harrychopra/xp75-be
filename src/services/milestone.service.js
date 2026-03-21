import * as milestoneModel from '../models/milestone.model.js';
import { ApiError } from '../utils/ApiError.js';

function getBadge(dayNumber) {
  return dayNumber === 25
    ? 'bronze'
    : dayNumber === 50
    ? 'silver'
    : dayNumber === 75
    ? 'gold'
    : null;
}

export async function awardBadgeIfEligible({ day_number, user_id }) {
  const badge = getBadge(day_number);
  if (!badge) return;

  const milestone = await milestoneModel.insert(user_id, badge);
  if (!milestone) throw new ApiError('Failed to create milestone', 500);
}

export const findAll = user_id => milestoneModel.findAll(user_id);

export async function remove(userId, day_number) {
  const badge = getBadge(day_number);
  if (!badge) return;

  await milestoneModel.remove(userId, badge);
}
