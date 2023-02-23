import { CommonResponse, UserResponse } from '@/src/shared'
import { Controller, Get, Inject, UseFilters } from '@nestjs/common'
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
  async getAllUser(): Promise<CommonResponse<UserResponse[]>> {
    const result = await this.userService.getListUsers()
    return result
  }
}
