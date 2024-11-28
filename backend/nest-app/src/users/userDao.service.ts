import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.schema.js";
import { Model } from "mongoose";
import { userSignupDto } from "./userSignup.dto.js";
import { guestUserSignInDto } from "./guestUserSignIn.dto.js";

@Injectable()
export class UserDao{
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}
    async findOne(pass: string, email: string): Promise<User>{
        const user = await this.userModel.findOne({email}).exec()
        if(user && user.password === pass){
            return user
        }else{
            throw new UnauthorizedException()
        }
    }

    async findAll(): Promise<any>{
        return await this.userModel.find().exec()
    }

    async create(userSignupDto: userSignupDto): Promise<User>{
        const { email } = userSignupDto
        const user = await this.userModel.findOne({email}).exec()
        if(user){
            throw new Error('User already exists')
        }
        return await this.userModel.create(userSignupDto)
    }

    async createGuest(name: guestUserSignInDto): Promise<User>{
        const { username } = name
        const user = await this.userModel.create({username, role: 'guest'})
        return user
    }


}