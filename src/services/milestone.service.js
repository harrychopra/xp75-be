import * as milestoneModel from '../models/milestone.model.js';
import { ApiError } from '../utils/ApiError.js';

export async function awardBadgeIfEligible({ day_number, user_id }) {
  const badgeType = day_number === 25
    ? 'bronze'
    : day_number === 50
    ? 'silver'
    : day_number === 75
    ? 'gold'
    : null;

  if (!badgeType) return;

  const milestone = await milestoneModel.insert(user_id, badgeType);
  if (!milestone) throw new ApiError('Failed to create milestone', 500);
}
