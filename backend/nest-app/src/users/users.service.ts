import { Injectable } from '@nestjs/common';
import { UserDao } from './userDao.service.js';
import { userDto } from './user.dto.js';

@Injectable()
export class UsersService {
    constructor(
    private readonly userDao: UserDao
){}
    async findOne(userDto: userDto): Promise<any> {
        const { username, pass } = userDto
       return this.userDao.findOne(username, pass)
    }

    async findAll(): Promise<any> {
        return this.userDao.findAll()
    }
}
