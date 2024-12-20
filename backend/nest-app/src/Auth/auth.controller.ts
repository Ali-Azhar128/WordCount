import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Request } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard.js';
import { userDto } from '../users/user.dto.js';
import { RequestWithUser } from './jwt/request-with-user.interface.js';
import { userSignupDto } from '../users/userSignup.dto.js';
import { guestUserSignInDto } from '../users/guestUserSignIn.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async signIn(
    @Body() userDto: userDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const { access_token } = await this.authService.signIn(userDto);
      res.cookie('jwt', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });
      const payload = await this.authService.getPayloadFromToken(access_token);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Login successful', access_token, user: payload });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Post('/register')
  async signUp(
    @Body() userSignupDto: userSignupDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const payload = await this.authService.signUp(userSignupDto);
      return res.json(payload);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('guestLogin')
  async guestLogin(@Body() username: guestUserSignInDto, @Res() res: Response) {
    try {
      const payload = await this.authService.guestLogin(username);
      res.cookie('jwt', payload.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });
      const access_token = payload.access_token;
      const user = await this.authService.getPayloadFromToken(access_token);
      res.status(200).json({ access_token, user });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  @Post('anonymousLogin')
  async anonymousLogin(@Res() res: Response) {
    try {
      const payload = await this.authService.anonymousSignin();
      res.cookie('jwt', payload.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });
      const access_token = payload.access_token;
      const user = await this.authService.getPayloadFromToken(access_token);
      res.status(200).json({ access_token, user });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}
