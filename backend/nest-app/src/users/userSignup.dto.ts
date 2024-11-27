import { IsNotEmpty, Length } from "class-validator";
import { IsUsernameValid } from "./validators/usernameValidator.js";

export class userSignupDto{
    
    @Length(3, 15, {message: 'Username must be atleast 3 characters long'})
    @IsNotEmpty({message: 'Username can not be empty'})
    @IsUsernameValid({message: 'Invalid Username'})
    username: string

    @Length(8, 100, {message: 'Password must be atleast 8 characters long'})
    @IsNotEmpty({message: 'Password can not be empty'})
    password: string

    // To-do: Add email validation
    @IsNotEmpty({message: 'Email can not be empty'})
    email: string

    @IsNotEmpty({message: 'Role can not be empty'})
    role: string
}