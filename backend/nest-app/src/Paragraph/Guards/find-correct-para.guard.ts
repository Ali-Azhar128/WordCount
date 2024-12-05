import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParaDOW } from '../paragraphDow.service.js';
import { RequestWithUser } from '../../Auth/Interface/request-with-user.interface.js';

@Injectable()
export class findCorrectParaGuard {
  constructor(private readonly paraDowService: ParaDOW) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { sub } = request.user;
    return true;
  }
}
