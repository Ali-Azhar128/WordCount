import { Request } from 'express';

export function extractTokenFromRequest(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  if (type === 'Bearer' && token) {
    console.log(token, 'token in extractTokenFromRequest');
    return token;
  }
  // return request.cookies?.jwt;
}
