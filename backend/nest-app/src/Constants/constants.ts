import dotenv from 'dotenv';

dotenv.config();

export class constants {
  static get jwtSecret(): string {
    return process.env.JWT_SECRET;
  }

  static get databaseUrl(): string {
    return process.env.MONGO_URI;
  }
}
