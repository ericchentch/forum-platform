import { CommonResponse, LoginRequest, LoginResponse } from '@/src/shared'
import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common'
import { HttpExceptionFilter } from '../exception/exception.handler'
import { AuthService } from '../service/auth.service'

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService
  ) {}

  @Post('/login')
  async insetUpdateUser(@Body() req: LoginRequest): Promise<CommonResponse<LoginResponse>> {
    const result = await this.authService.login(req)
    return result
  }
}
