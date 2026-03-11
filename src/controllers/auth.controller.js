import { APIError } from '../middleware/errors.js';
import * as AuthService from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, username, name } = req.body;
    if (!email || !password || !username || !name) {
      return res.status(400).json({
        error: 'email, password, username and name are required'
      });
    }
    const result = await AuthService.register({
      email,
      password,
      username,
      name
    });
    res.status(201).json(result);
  } catch (err) {
    if (err.code === '23505') {
      err = new APIError('account already exists', 400);
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const result = await AuthService.login({ email, password });
    if (!result) {
      return res.status(401).json({ error: 'user not recognized' });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
