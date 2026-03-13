CREATE TABLE users (
  id UUID PRIMARY KEY
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL, -- Note : Delete once auth is moved to supabase
  avatar_url VARCHAR(500),
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
  pages_read BOOL DEFAULT false,
  mood_rating INT,
  achievements VARCHAR(500),
  challenges VARCHAR(500),
  next_day_focus VARCHAR(500),
  progress_pic VARCHAR(500),
  all_complete BOOL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE milestones (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  badge_type VARCHAR(10) NOT NULL,
  awarded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_summaries (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL,
  interval INT NOT NULL,
  summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX ON days (profile_id, day_number);
CREATE UNIQUE INDEX ON milestones     (profile_id, badge_type);
CREATE UNIQUE INDEX ON weekly_summaries (profile_id, interval);

COMMENT ON COLUMN days.day_number IS '1-75';
COMMENT ON COLUMN reflections.mood_rating IS '1-5';
COMMENT ON COLUMN milestones.badge_type IS 'bronze (25), silver (50), gold (75)';
COMMENT ON COLUMN ai_summaries.interval IS '1-15';

ALTER TABLE profiles ADD FOREIGN KEY (id) REFERENCES users (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE days ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE milestones ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE ai_summaries ADD FOREIGN KEY (profile_id) REFERENCES profiles (id) DEFERRABLE INITIALLY IMMEDIATE;
