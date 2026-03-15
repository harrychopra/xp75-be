import { ApiError } from './ApiError.js';

const validateEmail = email => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError('Invalid email address', 400);
  }
};

const validatePassword = password => {
  if (
    (typeof password !== 'string')
    || (password.length < 8)
    || (!/[A-Z]/.test(password))
    || (!/[0-9]/.test(password))
    || (!/[^A-Za-z0-9]/.test(password))
  ) {
    throw new ApiError(
      'Password must be at least 8 characters and contain at least: one uppercase'
        + ' letter, one lowercase letter, one digit and one special character',
      400
    );
  }
};

const validateName = name => {
  if (typeof name !== 'string' || name.trim().length < 3) {
    throw new ApiError('Name must be at least 3 characters', 400);
  }
};

const validateAvatarUrl = url => {
  if (!/^(http|https):\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
    throw new ApiError('Avatar must be a valid url', 400);
  }
};

export default function validate(fields, req) {
  const fieldFn = {
    email: validateEmail,
    name: validateName,
    avatar_url: validateAvatarUrl,
    password: validatePassword,
    current_password: validatePassword,
    new_password: validatePassword
  };

  for (const field of fields) {
    if (!fieldFn[field]) {
      throw new Error(`Validator for field "${field}" not defined`);
    }

    if (req.body?.[field] === undefined || req.body?.[field] === null) {
      throw new ApiError(`${field} cannot be empty`, 400);
    }

    fieldFn[field](req.body[field]);
  }
}
