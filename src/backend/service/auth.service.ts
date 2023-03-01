import { CommonResponse, LoginRequest, LoginResponse } from '@/src/shared'
import { Inject, Injectable } from '@nestjs/common'
import { NotfoundException } from '../exception'
import { InvalidRequest } from '../exception/invalid.request.exception'
import { defaultCommonResponse } from '../inventory'
import { UserEntity } from '../repository/user/user.entity'
import { UserRepository } from '../repository/user/user.repository'
import { generateToken } from './../../libs/jwt.function'
import { EMAIL_REGEX, PHONE_REGEX, USERNAME_REGEX } from './../constants/type.validation'

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private useRepository: UserRepository
  ) {}

  async findUserByUsername(username: string): Promise<UserEntity> {
    let type = ''
    if (username.match(USERNAME_REGEX)) type = 'username'
    if (username.match(EMAIL_REGEX)) type = 'email'
    if (username.match(PHONE_REGEX)) type = 'phone'
    const result = await this.useRepository.findOne({ key: type, value: username })
    if (!result) {
      throw new NotfoundException('not found user')
    }
    if (result.isActive === 0) {
      throw new NotfoundException('not found user')
    }
    return result
  }

  async login(req: LoginRequest): Promise<CommonResponse<LoginResponse>> {
    const { username, password } = req
    let findUser = await this.findUserByUsername(username)
    //password in request must be hashed
    if (password !== findUser.password) {
      throw new InvalidRequest('password not match')
    }
    return {
      ...defaultCommonResponse,
      data: {
        token: generateToken({ userId: String(findUser.id) }),
        userId: String(findUser.id),
      },
    }
  }
}
