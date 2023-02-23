import { Module } from '@nestjs/common'
import { UserController } from '../controller'
import { UserService } from '../service/user/user.service'
import { UserRepository } from './../repository/user/user.repository'

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
