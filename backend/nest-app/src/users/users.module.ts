import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema.js';
import { UserDao } from './userDao.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  providers: [UsersService, UserDao],
  exports: [UsersService]
})
export class UsersModule {
 
}
