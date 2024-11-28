import { Injectable } from '@nestjs/common';
import { UserDao } from './userDao.service.js';
import { userDto } from './user.dto.js';
import { userSignupDto } from './userSignup.dto.js';
import { guestUserSignInDto } from './guestUserSignIn.dto.js';

@Injectable()
export class UsersService {
    constructor(
    private readonly userDao: UserDao
){}
    async findOne(userDto: userDto): Promise<any> {
        const { pass, email } = userDto
       return this.userDao.findOne(pass, email)
    }

    async findAll(): Promise<any> {
        return this.userDao.findAll()
    }

    async create(userSignupDto: userSignupDto): Promise<any> {
        return this.userDao.create(userSignupDto)
    }

    async createGuest(username: guestUserSignInDto): Promise<any> {
        return this.userDao.createGuest(username)
    }
}
