import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class NoSpecialCharactersGuard implements CanActivate{
    private specialCharacters: Set<string>

    constructor(){
        this.specialCharacters = new Set(['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '\\', '|', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?', '`', '~', '，', '\n'])
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const body = request.body

        for(const key in body){
            if(body.paragraph){
                if(typeof body[key] === 'string' && this.isAllSpecialCharacters(body[key])){
                    throw new BadRequestException('Input should not contain only special characters')
                }
            }
           
        }
        if(!body.paragraph.trim()){
            throw new BadRequestException('Empty paragraph is not allowed')
        }
        return true
    }

    private isAllSpecialCharacters(text: string): boolean{
        for(const char of text){
            if(!this.specialCharacters.has(char)){
                return false
            }
        }
        return true
    }
}