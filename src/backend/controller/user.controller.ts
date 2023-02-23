import { CommonResponse, UserResponse } from '@/src/shared'
import { Controller, Get, Inject } from '@nestjs/common'
import { UserService } from '../service/user/user.service'

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
