# XP75 - Backend API

REST API for XP75, a companion app and tracker for the 75 Hard challenge. Handles user authentication, daily check-ins, milestone tracking, and AI-generated weekly summaries.

API documentation is available at [`https://xp75-be.onrender.com`](https://xp75-be.onrender.com).

API is available at [`https://xp75-be.onrender.com/api/version`](https://xp75-be.onrender.com/api/version)

---

## What it tracks

Each day (1-75), a user logs:

- Two workouts - one outdoor, one indoor
- Diet adherence
- Water consumption
- At least 10 pages of non-fiction reading
- Mood rating (1-5)
- Achievements and challenges from the day
- Focus for the next day
- A progress photo

Every 7th day, the app generates a personalised AI summary covering the week's wins, patterns, and suggestions for the week ahead.

Milestones are awarded automatically at day 25 (bronze), 50 (silver), and 75 (gold).

---

## Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Auth:** JWT (access + refresh token rotation)

---

## Database schema

![Entity Relationship Diagram](assets/erd.png)

### Tables

**`users`**
Core account table. Stores credentials and profile info. `password_hash` is never returned by any endpoint.

**`tokens`**
Refresh token store. Each token is hashed before storage. Tokens can be individually revoked. Cascades on user deletion.

**`days`**
One row per user per day (enforced by unique index on `user_id, day_number`). `day_number` is 1-75. `mood_rating` is 1-5. `all_complete` is `true` when all five core tasks are checked off for that day.

**`milestones`**
Awarded at day 25 (`bronze`), day 50 (`silver`), and day 75 (`gold`). One badge per type per user, enforced by unique index.

**`weekly_summaries`**
One AI-generated summary per user per week, generated on day 7, 14, 21, etc. Stored as free text. Unique index on `user_id, week`.

---

## Local setup

### Prerequisites

- Node.js
- PostgreSQL (running locally or as a docker container)

### 1. Create the database

```sql
CREATE DATABASE xp75_dev;
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env.development` file in the project root:

```env
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/xp75_dev

# Access token
ACCESS_SALT=<dev-access-salt>
ACCESS_EXP=1h

# Refresh token
REFRESH_SALT=<dev-refresh-salt>
REFRESH_EXP=7d
```

> Use distinct values for `ACCESS_SALT` and `REFRESH_SALT`. Do not reuse the same secret for both.

### 4. Run migrations

```bash
npm run db:setup
```

This runs `db/setup.js`, which executes `db/schema.sql` against the configured database.

### 5. Start the server

```bash
npm run dev # development
```

The API will be available at `http://localhost:3000`.

---

## Auth overview

For a complete auth flow, see this [diagram](assets/auth-flow.png) that covers all five happy path flows in sequence.

The API uses two tokens:

| Token         | Lifetime |
| ------------- | -------- |
| Access token  | 1h       |
| Refresh token | 7d       |

When an access token expires, call `POST /api/auth/refresh`. If the refresh token is also expired, the user must log in again. Changing a password invalidates all existing sessions immediately.

---

## Environment variables

| Variable       | Description                            |
| -------------- | -------------------------------------- |
| `PORT`         | Port the server listens on             |
| `DATABASE_URL` | PostgreSQL connection string           |
| `ACCESS_SALT`  | Secret used to sign access tokens      |
| `ACCESS_EXP`   | Access token expiry (e.g. `1h`, `15m`) |
| `REFRESH_SALT` | Secret used to sign refresh tokens     |
| `REFRESH_EXP`  | Refresh token expiry (e.g. `7d`)       |
