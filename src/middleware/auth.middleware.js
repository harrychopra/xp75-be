import jwt from 'jsonwebtoken';
import { findById } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';

const accessSalt = process.env.ACCESS_SALT;

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError('No authorization header provided', 401);
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError('Unrecognized authorization header', 401);
    }

    const token = parts[1];
    const decoded = jwt.verify(token, accessSalt);
    const user = await findById(decoded.sub);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    req.user = user;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access token expired'
      });
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'SyntaxError') {
      return res.status(401).json({
        error: 'Invalid access token'
      });
    }
    next(err);
  }
}
