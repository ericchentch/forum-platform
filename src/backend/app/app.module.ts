import { Module } from '@nestjs/common'
import { UserModule } from '../modules'
import { AppController } from './app.controller'

@Module({
  imports: [UserModule],
  controllers: [AppController],
})
export class AppModule {}
