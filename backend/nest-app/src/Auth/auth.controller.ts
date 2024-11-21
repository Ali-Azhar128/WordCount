import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthDto } from "./auth.dto.js";
import { Request } from "@nestjs/common";
import { Response } from "express";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('/login')
    async signIn(

        @Body() authDto: AuthDto,
        @Req() req: Request,
        @Res() res: Response
    ){
        try {
            console.log('object')
            const user = await this.authService.signIn(authDto)
            return res.json(user);
        } catch (error) {
            return res.status(400).json
        }
    }
    
}