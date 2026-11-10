import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8000,
  corsOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://tutor_admin:secure_dev_password@localhost:5432/find_my_tutor_db',
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET || 'find_my_tutor_bd_access_secret_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'find_my_tutor_bd_refresh_secret_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
    : 12,
};
