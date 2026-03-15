import bcrypt from 'bcryptjs';
import * as tokenModel from '../models/token.model.js';
import * as userModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export async function createUser({ email, password, name, avatar_url }) {
  const emailInUse = await userModel.isEmailTaken(email);
  if (emailInUse) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userModel.createUser({
    email,
    name,
    passwordHash,
    avatarUrl: avatar_url
  });

  return user;
}

export const findByEmail = email => userModel.findByEmail(email);

export const findById = id => userModel.findById(id);

export const isEmailTaken = email => userModel.isEmailTaken(email);

export const updateProfile = (userId, { name, avatarUrl }) =>
  userModel.updateProfile(userId, { name, avatarUrl });

export async function updatePassword(userId, new_password) {
  const newHash = await bcrypt.hash(new_password, 10);

  await userModel.updatePassword(userId, newHash);

  await tokenModel.revokeAllUserTokens(userId);
}
