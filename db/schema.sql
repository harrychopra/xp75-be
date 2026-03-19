CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP INDEX IF EXISTS idx_tokens_user_id;

DROP INDEX IF EXISTS idx_tokens_hash;

DROP INDEX IF EXISTS idx_user_id_week;

DROP INDEX IF EXISTS idx_user_id_badge_type;

DROP INDEX IF EXISTS idx_user_id_day_number;

DROP TABLE IF EXISTS weekly_summaries;

DROP TABLE IF EXISTS milestones;

DROP TABLE IF EXISTS days;

DROP TABLE IF EXISTS tokens;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(255) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  password_hash varchar(255) NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens(
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  revoked boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE days(
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number int NOT NULL,
  diet_adhered bool DEFAULT FALSE,
  outdoor_workout_completed bool DEFAULT FALSE,
  indoor_workout_completed bool DEFAULT FALSE,
  water_consumed bool DEFAULT FALSE,
  pages_read bool DEFAULT FALSE,
  mood_rating int,
  achievements varchar(500),
  challenges varchar(500),
  next_day_focus varchar(500),
  progress_pic_url text,
  progress_pic_key text,
  created_at timestamp DEFAULT NOW()
);

CREATE TABLE milestones(
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type varchar(10) NOT NULL,
  awarded_at timestamp DEFAULT NOW()
);

CREATE TABLE weekly_summaries(
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week int NOT NULL,
  summary text,
  created_at timestamp DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_id_day_number ON days(user_id, day_number);

CREATE UNIQUE INDEX idx_user_id_badge_type ON milestones(user_id, badge_type);

CREATE UNIQUE INDEX idx_user_id_week ON weekly_summaries(user_id, week);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);

CREATE INDEX idx_tokens_hash ON tokens(hash);

COMMENT ON COLUMN days.day_number IS '1-75';

COMMENT ON COLUMN days.mood_rating IS '1-5';

COMMENT ON COLUMN milestones.badge_type IS 'bronze (25), silver (50), gold (75)';

