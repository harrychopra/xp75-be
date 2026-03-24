import bcrypt from 'bcryptjs';
import * as userService from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import { getUrl } from '../utils/storage.js';
import validate from '../utils/validate.js';

export async function get(req, res, next) {
  const { user } = req;
  try {
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: await getUrl(user.avatar_key)
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validate(['name'], req.body);
    const { name } = req.body;

    const user = await userService.update(
      req.user.id,
      name,
      req.file
    );

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: await getUrl(user.avatar_key)
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    validate(['current_password', 'new_password'], req.body);
    const { current_password, new_password } = req.body;

    const isPwdValid = await bcrypt.compare(
      current_password,
      req.user.password_hash
    );
    if (!isPwdValid) {
      throw new ApiError('Current password is incorrect', 401);
    }

    await userService.changePassword(req.user.id, new_password);

    res.status(200).json({
      message: 'Password changed successfully. Please log in again.'
    });
  } catch (err) {
    next(err);
  }
}
