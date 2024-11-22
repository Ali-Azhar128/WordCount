import { Injectable, UnauthorizedException } from "@nestjs/common";
import { userDto } from "../users/user.dto.js";
import { UsersService } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService{
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(userDto: userDto): Promise<{access_token: string}>{
        const user = await this.userService.findOne(userDto)
        console.log(user.role, 'user')
        const seed = uuidv4()
        const payload = {sub: user.id, role: user.role, seed}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async getPayloadFromToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token, {
          secret: 'abc123',
        });
      }

    
}