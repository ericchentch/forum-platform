import { CommonResponse, UserResponse } from '@/src/shared'
import { Controller, Get, Inject, Req, UseFilters } from '@nestjs/common'
import { Request } from 'express'
import { HttpExceptionFilter } from '../exception/exception.handler'
import { UserService } from '../service/user/user.service'

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private userService: UserService
  ) {}

  @Get('/get-list')
  async getAllUser(@Req() req: Request): Promise<CommonResponse<UserResponse[]>> {
    const result = await this.userService.getListUsers(req)
    return result
  }
}
