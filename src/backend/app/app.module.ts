import { Module } from '@nestjs/common'
import { UserModule } from '../modules'
import { AuthModule } from '../modules/auth.module'
import { AppController } from './app.controller'

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
