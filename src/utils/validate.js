import { ApiError } from './ApiError.js';

const validateEmail = (email, _) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError('Invalid email address', 400);
  }
};

const validatePassword = (password, _) => {
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

const validateName = (name, _) => {
  if (typeof name !== 'string' || name.trim().length < 3) {
    throw new ApiError('Name must be at least 3 characters', 400);
  }
};

const validateAvatarUrl = (url, _) => {
  if (!/^(http|https):\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
    throw new ApiError('Avatar must be a valid url', 400);
  }
};

export const validateDayNumber = (day_number, _) => {
  const dayNumber = parseInt(day_number, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 75) {
    throw new ApiError(`Day number must be between 1 and 75 inclusive`, 400);
  }
};

const validateMoodRating = (rating, _) => {
  const dayNumber = parseInt(rating, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 5) {
    throw new ApiError(`Mood rating must be between 1 and 5 inclusive`, 400);
  }
};

const validateBoolean = (val, field) => {
  if (typeof val !== 'boolean') {
    throw new ApiError(`${field} must be a boolean.`, 400);
  }
};

const validateLongText = (text, field) => {
  if (
    typeof text !== 'string' || text.trim().length < 10
    || text.trim().length > 500
  ) {
    throw new ApiError(
      `${field} must be at least 10 characters and must not exceed 500 characters`,
      400
    );
  }
};

export default function validate(requiredFields, data) {
  const fieldFn = {
    email: validateEmail,
    name: validateName,
    avatar_url: validateAvatarUrl,
    password: validatePassword,
    current_password: validatePassword,
    new_password: validatePassword,
    day_number: validateDayNumber,
    diet_adhered: validateBoolean,
    outdoor_workout_completed: validateBoolean,
    indoor_workout_completed: validateBoolean,
    water_consumed: validateBoolean,
    pages_read: validateBoolean,
    mood_rating: validateMoodRating,
    achievements: validateLongText,
    challenges: validateLongText,
    next_day_focus: validateLongText
  };

  for (const field of requiredFields) {
    if (!fieldFn[field]) {
      throw new Error(`Validator for field "${field}" not defined`);
    }

    requiredFields.filter(field => data[field] === undefined);

    if (data[field] === undefined || data[field] === null) {
      throw new ApiError(`${field} cannot be empty`, 400);
    }

    fieldFn[field](data[field], field);
  }
}
