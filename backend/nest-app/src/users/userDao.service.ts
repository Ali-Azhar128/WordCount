import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./users.schema.js";
import { Model } from "mongoose";

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
}