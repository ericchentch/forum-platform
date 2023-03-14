import { comparePassword, decodeBase64, hashPassword } from '@/src/libs'
import { CommonResponse, LoginRequest, LoginResponse, RegisterRequest } from '@/src/shared'
import { Inject, Injectable } from '@nestjs/common'
import { generateToken } from '../../../libs/jwt.function'
import { EMAIL_REGEX, PHONE_REGEX, USERNAME_REGEX } from '../../constants/type.validation'
import { NotfoundException } from '../../exception'
import { InvalidRequest } from '../../exception/invalid.request.exception'
import { userEntity } from '../../inventory'
import { UserEntity } from '../../repository/user/user.entity'
import { UserRepository } from '../../repository/user/user.repository'
import { validate } from '../../validation'
import { convertObjectToKeyValue, objectMapper } from '../common.service'
import { renderSuccessResponse } from './../common.service'
import { LoginValidateSchema, RegisterValidateSchema } from './auth.validator'

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private useRepository: UserRepository
  ) {}

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    let type = ''
    if (username.match(USERNAME_REGEX)) type = 'username'
    if (username.match(EMAIL_REGEX)) type = 'email'
    if (username.match(PHONE_REGEX)) type = 'phone'
    const result = await this.useRepository.findOne({ key: type, value: username })
    return result
  }

  checkUser(result: UserEntity | null): UserEntity {
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
    const resultVal = validate<LoginRequest>(req, LoginValidateSchema)
    if (resultVal.isError) {
      throw new InvalidRequest('invalid request', resultVal.error)
    }
    let findUser = this.checkUser(await this.findUserByUsername(username))
    //password in request must be base64
    const rawPassword = decodeBase64(password)
    if (!comparePassword(rawPassword, findUser.password)) {
      throw new InvalidRequest('password not match', { password: 'password not match' })
    }
    return renderSuccessResponse<LoginResponse>({
      data: {
        token: generateToken({ userId: String(findUser.id) }),
        userId: String(findUser.id),
      },
    })
  }

  async register(req: RegisterRequest): Promise<CommonResponse<null>> {
    const { username, password, email, phone } = req
    const resultVal = validate<RegisterRequest>(req, RegisterValidateSchema)
    if (resultVal.isError) {
      throw new InvalidRequest('invalid request', resultVal.error)
    }
    const findUsername = await this.useRepository.findOne({ key: 'username', value: username })
    if (findUsername) {
      throw new InvalidRequest('username existed', { username: 'username existed' })
    }
    const findEmail = await this.useRepository.findOne({ key: 'email', value: email })
    if (findEmail) {
      throw new InvalidRequest('email existed', { email: 'email existed' })
    }
    const findPhone = await this.useRepository.findOne({ key: 'phone', value: phone })
    if (findPhone) {
      throw new InvalidRequest('phone existed', { phone: 'phone existed' })
    }
    const user = objectMapper<RegisterRequest, UserEntity>(req, userEntity)
    const hashedPassword = await hashPassword(decodeBase64(password))
    await this.useRepository.insertAndUpdate(
      convertObjectToKeyValue({ ...user, password: hashedPassword })
    )
    return renderSuccessResponse<null>({ message: 'register success' })
  }

  async forgotPassword(email: string): Promise<CommonResponse<null>> {
    const findUser = await this.useRepository.findOne({ key: 'email', value: email })
    if (!findUser) {
      throw new InvalidRequest('not found user', {})
    }
    const hashedPassword = await hashPassword(process.env.DEFAULT_PASSWORD || '')
    await this.useRepository.insertAndUpdate(
      convertObjectToKeyValue({ ...findUser, password: hashedPassword })
    )
    return renderSuccessResponse<null>({ message: 'email forgot password sent!' })
  }
}
