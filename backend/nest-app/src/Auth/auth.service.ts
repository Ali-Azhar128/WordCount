import { Injectable, UnauthorizedException } from "@nestjs/common";
import { userDto } from "../users/user.dto.js";
import { UsersService } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid'
import { userSignupDto } from "src/users/userSignup.dto.js";
import { guestUserSignInDto } from "src/users/guestUserSignIn.dto.js";
import { access } from "fs";

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
        const payload = {sub: user.id, role: user.role, seed, username: user.username}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async getPayloadFromToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token, {
          secret: 'abc123',
        });
    }

    async signUp(userSignupDto: userSignupDto){
        const user = await this.userService.create(userSignupDto)
        const seed = uuidv4()
        const payload = {sub: user.id, role: 'user', seed}
        return {
            access_token: await this.jwtService.signAsync(payload),
            username: user.username
        }
    }
    async guestLogin(username: guestUserSignInDto){
        const user = await this.userService.createGuest(username)
        const seed = uuidv4()
        const payload = {sub: user.id, role: 'guest', seed, username: user.username}
        return {
            access_token: await this.jwtService.signAsync(payload),
            username: user.username
        }
    }

    async anonymousSignin(){
        const seed = uuidv4()
        const payload = {sub: 'anonymous', role: 'anonymous', seed}
        return {
            access_token: await this.jwtService.signAsync(payload),
            username: 'anonymous'
        }
    }


    
}