import { Request } from 'express';

export function extractTokenFromRequest(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  if (type === 'Bearer' && token) {
    return token;
  }
  return request.cookies?.jwt;
}