import { IsNotEmpty, Length } from "class-validator";
import { IsUsernameValid } from "./validators/usernameValidator.js";

export class guestUserSignInDto {
    @Length(3, 15, {message: 'Username must be atleast 3 characters long'})
    @IsNotEmpty({message: 'Username can not be empty'})
    @IsUsernameValid({message: 'Invalid Username'})
    username: string

}