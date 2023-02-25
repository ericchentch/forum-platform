import { CommonResponse, UserResponse } from '@/src/shared'
import { Controller, Get, Inject, Post, Put, Req, UseFilters } from '@nestjs/common'
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

  @Post('/insert-or-update')
  async insetUpdateUser(@Req() req: Request): Promise<CommonResponse<null>> {
    const result = await this.userService.insertAndUpdateUser(req)
    return result
  }

  @Put('active-user')
  async activeUser(@Req() req: Request): Promise<CommonResponse<null>> {
    const result = await this.userService.changeActive(req, true)
    return result
  }

  @Put('deactivate-user')
  async deactivateUser(@Req() req: Request): Promise<CommonResponse<null>> {
    const result = await this.userService.changeActive(req, false)
    return result
  }
}
