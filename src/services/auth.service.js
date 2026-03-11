import { v4 as uuid } from 'uuid';
import * as profileModel from '../models/profile.model.js';
import * as userModel from '../models/user.model.js';

export const register = async ({ email, password, username, name }) => {
  const id = uuid();
  await userModel.create(id);
  const profile = await profileModel.create(id, email, username, name);
  return { ...profile };
};

export const login = async ({ email, password }) =>
  profileModel.getByEmail(email);

export const getById = async id => userModel.getById(id);
