import dotenv from 'dotenv';

export default () => {
  const envPath = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env';

  dotenv.config({ path: envPath });
};
