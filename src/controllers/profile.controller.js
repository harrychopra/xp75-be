import bcrypt from 'bcryptjs';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import validate from '../utils/validate.js';

export async function getProfile(req, res, next) {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    validate(['name', 'avatar_url'], req);
    const { name, avatar_url } = req.body;

    const updatedUser = await userService.updateProfile(req.user.id, {
      name,
      avatarUrl: avatar_url
    });

    if (!updatedUser) {
      throw new ApiError('User not found', 404);
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    validate(['current_password', 'new_password'], req);
    const { current_password, new_password } = req.body;

    const isPwdValid = await bcrypt.compare(
      current_password,
      req.user.password_hash
    );
    if (!isPwdValid) {
      throw new ApiError('Current password is incorrect', 401);
    }

    await userService.updatePassword(req.user.id, new_password);

    res.status(200).json({
      message: 'Password changed successfully. Please log in again.'
    });
  } catch (err) {
    next(err);
  }
}
