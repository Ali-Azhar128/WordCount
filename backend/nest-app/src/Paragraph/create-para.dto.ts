import {IsString, IsNotEmpty, Length} from 'class-validator'

export class CreateParaDto{
    @IsString()
    @IsNotEmpty({message: 'Paragraph is required'})
    @Length(1, 2000, {message: 'Paragraph should be between 1 and 2000 characters'})
    paragraph: string

    @IsString()
    @IsNotEmpty()
    ip: string

    @IsNotEmpty()
    @IsString()
    user: string

    @IsString()
    type: string

}