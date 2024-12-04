import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString({ message: 'Please provide valid email' })
  @IsNotEmpty({ message: 'Email can not be empty' })
  @IsEmail({}, { message: 'Please provide valid email' })
  email: string;

  @Length(8, 100, { message: 'Password must be atleast 8 characters long' })
  pass: string;
}
