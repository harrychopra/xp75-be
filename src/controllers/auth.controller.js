import bcrypt from 'bcryptjs';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import validate from '../utils/validate.js';

export async function register(req, res, next) {
  try {
    validate(['email', 'password', 'name', 'avatar_url'], req);
    const { email, password, name, avatar_url } = req.body;

    const user = await userService.createUser({
      name,
      email,
      password,
      avatar_url
    });

    const { accessToken, refreshToken, expiresAt } = await authService
      .generateTokens(user.id);

    setRefreshCookie(res, refreshToken, expiresAt);

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      },
      accessToken
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    validate(['email', 'password'], req);
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isPwdValid = await bcrypt.compare(password, user.password_hash);
    if (!isPwdValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken, expiresAt } = await authService
      .generateTokens(user.id);

    setRefreshCookie(res, refreshToken, expiresAt);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url
      },
      accessToken
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      throw new ApiError('No refresh token provided', 401);
    }

    const userId = await authService.verifyAndRotateToken(
      rawRefreshToken
    );

    if (!userId) {
      clearRefreshCookie(res);
      return res.status(401).json({
        error: 'Refresh token expired or invalid. Please log in again.'
      });
    }

    const { accessToken, refreshToken, expiresAt } = await authService
      .generateTokens(userId);

    setRefreshCookie(res, refreshToken, expiresAt);

    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (rawRefreshToken) {
      await authService.revokeSingleToken(rawRefreshToken);
    }

    clearRefreshCookie(res);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

function setRefreshCookie(res, refreshToken, expiresAt) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth/',
    expires: expiresAt
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth/'
  });
}
