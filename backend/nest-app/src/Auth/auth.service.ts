import { Injectable, UnauthorizedException } from "@nestjs/common";
import { userDto } from "../users/user.dto.js";
import { UsersService } from "../users/users.service.js";

@Injectable()
export class AuthService{
    constructor(private readonly userService: UsersService){}

    async signIn(userDto: userDto): Promise<any>{
        const user = await this.userService.findOne(userDto)
        return user
    }

    
}