import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import * as tokenModel from '../models/token.model.js';
import * as userModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { upload } from '../utils/storage.js';

const avatarPrefix = '00000000-0000-0000-0000-000000000000';

export async function create(name, email, password, avatarKey) {
  if (await userModel.isEmailTaken(email)) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await userModel.create(
    email,
    name,
    passwordHash,
    `${avatarPrefix}/${avatarKey}`
  );
}

export const findByEmail = email => userModel.findByEmail(email);

export const find = id => userModel.find(id);

export const isEmailTaken = email => userModel.isEmailTaken(email);

export async function update(user_id, name, file = null) {
  const args = { user_id, name };

  if (file) {
    args['avatar_key'] = await upload(user_id, file);
  }

  return await userModel.update(args);
}

export async function changePassword(userId, new_password) {
  const newHash = await bcrypt.hash(new_password, 10);

  await userModel.changePassword(userId, newHash);

  await tokenModel.revokeAllUserTokens(userId);
}
