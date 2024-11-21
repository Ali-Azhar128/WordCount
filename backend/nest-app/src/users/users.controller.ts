import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from './users.service.js';
import { userDto } from './user.dto.js';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ){}

    @Post('/login')
    async loginUser(
        @Body() userDto: userDto, 
        @Req() req: Request, 
        @Res() res: Response
    ): Promise<any>{
       try {
        const user = await this.userService.findOne(userDto)
        return res.json(user)
       } catch (error) {
        console.log(error)
        return res.status(400).json({message: error.message})
       }
    }

    @Get('/all')
    async getAllUsers(@Res() res: Response): Promise<any>{
        try {
            const users = await this.userService.findAll()
            return res.json(users)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}
