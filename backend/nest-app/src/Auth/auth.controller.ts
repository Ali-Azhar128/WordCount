import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthDto } from "./auth.dto.js";
import { Request } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard.js";
import { userDto } from "../users/user.dto.js";
import { RequestWithUser } from "./jwt/request-with-user.interface.js";
import { userSignupDto } from "../users/userSignup.dto.js";


@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('/login')
    async signIn(

        @Body() userDto: userDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ){
        try {
            const { access_token } = await this.authService.signIn(userDto)
            res.cookie('jwt', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, 
              });
              console.log(access_token, 'access_token')
              const payload = await this.authService.getPayloadFromToken(access_token);
              return res.status(HttpStatus.OK).json({ message: 'Login successful',
                access_token,
                user: payload
               });
        } catch (error) {
            return res.status(400).json({message: error.message})
        }
    }

    @Post('/register')
    async signUp(
        @Body() userSignupDto: userSignupDto,
        @Req() req: Request,
        @Res() res: Response
    ){
        try {
            const payload = await this.authService.signUp(userSignupDto)
            console.log(payload, 'user payload')
            return res.json(payload)
        } catch (error) {
            return res.status(400).json(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
    
}