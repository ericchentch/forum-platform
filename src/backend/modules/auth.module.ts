import { Module } from '@nestjs/common'
import { AuthController } from '../controller/auth.controller'
import { UserRepository } from '../repository/user/user.repository'
import { AuthService } from '../service/auth/auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
