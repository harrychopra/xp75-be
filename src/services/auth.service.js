import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as tokenModel from '../models/token.model.js';

const accessSalt = process.env.ACCESS_SALT;
const accessExp = process.env.ACCESS_EXP;
const refreshExp = process.env.REFRESH_EXP;

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getRefreshExpiry() {
  const expiry = refreshExp;
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid refresh expiry format: ${expiry}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const ms = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(Date.now() + value * ms[unit]);
}

export async function generateTokens(userId) {
  const accessToken = jwt.sign({ sub: userId }, accessSalt, {
    expiresIn: accessExp
  });

  const refreshToken = crypto.randomBytes(64).toString('hex');
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshExpiry();

  await tokenModel.saveToken(userId, tokenHash, expiresAt);

  return { accessToken, refreshToken, expiresAt };
}

export async function verifyAndRotateToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  const storedToken = await tokenModel.getToken(tokenHash);

  if (!storedToken) return null;

  if (storedToken.revoked) {
    await tokenModel.revokeAllUserTokens(storedToken.user_id);
    return null;
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    await tokenModel.revokeTokenById(storedToken.id);
    return null;
  }

  await tokenModel.revokeTokenById(storedToken.id);
  return storedToken.user_id;
}

export async function revokeSingleToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  await tokenModel.revokeTokenByHash(tokenHash);
}
