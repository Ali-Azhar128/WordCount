import { IsNotEmpty, IsString, Length } from "class-validator";

export class userDto{
    @IsString({message: 'Please provide valid username'})
    @IsNotEmpty({message: 'Username can not be empty'})
    username: string

    @Length(8, 100, {message: 'Password must be atleast 8 characters long'})
    pass: string
}