import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    role: string;
    seed: string;
    username: string;
    iat: number;
    exp: number;
  };
}