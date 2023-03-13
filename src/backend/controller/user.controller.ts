import { CommonResponse, UserRequest, UserResponse } from '@/src/shared'
import { Controller, Get, Inject, Post, Put, UseFilters } from '@nestjs/common'
import { Request } from 'express'
import { CustomBody, CustomParamOne, CustomRequest } from '../decorator'
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
  async getAllUser(@CustomRequest() req: Request): Promise<CommonResponse<UserResponse[]>> {
    const result = await this.userService.getListUsers(req)
    return result
  }

  @Post('/insert-or-update')
  async insetUpdateUser(@CustomBody() req: UserRequest): Promise<CommonResponse<null>> {
    const result = await this.userService.insertAndUpdateUser(req)
    return result
  }

  @Put('active-user')
  async activeUser(@CustomParamOne('id') id: string): Promise<CommonResponse<null>> {
    const result = await this.userService.changeActive(id, true)
    return result
  }

  @Put('deactivate-user')
  async deactivateUser(@CustomParamOne('id') id: string): Promise<CommonResponse<null>> {
    const result = await this.userService.changeActive(id, false)
    return result
  }
}
