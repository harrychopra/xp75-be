CREATE TABLE users (
  id UUID PRIMARY KEY
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL, -- Note to self: Delete once auth is moved to supabase
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  completed BOOL DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE days (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  day_number INT NOT NULL,
  diet_adhered BOOL DEFAULT false,
  outdoor_workout_completed BOOL DEFAULT false,
  indoor_workout_completed BOOL DEFAULT false,
  water_consumed BOOL DEFAULT false,
  currently_reading INT,
  progress_pic VARCHAR(500),
  all_complete BOOL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reflections (
  id SERIAL PRIMARY KEY,
  day_id INT NOT NULL,
  mood_rating INT,
  achievements VARCHAR(500),
  challenges VARCHAR(500),
  next_day_focus VARCHAR(300),
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  milestone INT NOT NULL,
  badge_type VARCHAR(10) NOT NULL,
  awarded_at TIMESTAMP DEFAULT (NOW())
);

CREATE TABLE weekly_summaries (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  week INT NOT NULL,
  summary TEXT,
  created_at TIMESTAMP DEFAULT (NOW())
);

CREATE UNIQUE INDEX ON days (profile_id, day_number);
CREATE UNIQUE INDEX ON achievements     (profile_id, milestone);
CREATE UNIQUE INDEX ON weekly_summaries (profile_id, week);
CREATE UNIQUE INDEX ON reflections      (day_id);

COMMENT ON COLUMN days.day_number IS '1-75';
COMMENT ON COLUMN reflections.mood_rating IS '1-5';
COMMENT ON COLUMN achievements.milestone IS '25, 50, 75';
COMMENT ON COLUMN achievements.badge_type IS 'bronze (25), silver (50), gold (75)';
COMMENT ON COLUMN weekly_summaries.week IS '1-11';

ALTER TABLE profiles ADD FOREIGN KEY (id) REFERENCES users (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE days ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE days ADD FOREIGN KEY (currently_reading) REFERENCES books (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE reflections ADD FOREIGN KEY (day_id) REFERENCES days (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE books ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE achievements ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE weekly_summaries ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
