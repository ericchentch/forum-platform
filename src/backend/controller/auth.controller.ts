import { CommonResponse, LoginRequest, LoginResponse, RegisterRequest } from '@/src/shared'
import { Body, Controller, Get, Inject, Post, UseFilters } from '@nestjs/common'
import { CustomParamOne } from '../decorator'
import { HttpExceptionFilter } from '../exception/exception.handler'
import { AuthService } from '../service/auth/auth.service'

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService
  ) {}

  @Post('/login')
  async login(@Body() req: LoginRequest): Promise<CommonResponse<LoginResponse>> {
    const result = await this.authService.login(req)
    return result
  }

  @Post('/register')
  async register(@Body() req: RegisterRequest): Promise<CommonResponse<null>> {
    const result = await this.authService.register(req)
    return result
  }

  @Get('/forgot-password')
  async forgotPassword(@CustomParamOne('email') email: string): Promise<CommonResponse<null>> {
    const result = await this.authService.forgotPassword(email)
    return result
  }
}
