import { hashPassword } from '@/src/libs'
import { CommonResponse } from '@/src/shared'
import { UserResponse } from '@/src/shared/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UserRequest } from '../../../shared/user.dto'
import { ID_FIELD_USER } from '../../constants'
import { NotfoundException } from '../../exception'
import { InvalidRequest } from '../../exception/invalid.request.exception'
import { defaultCommonResponse, defaultUserResponse, userEntity } from '../../inventory'
import { UserEntity } from '../../repository/user/user.entity'
import { UserRepository } from '../../repository/user/user.repository'
import { validate } from '../../validation'
import { convertObjectToKeyValue, objectMapper } from '../common.service'
import { UserValidatorSchema } from './user.validator'

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private useRepository: UserRepository
  ) {}

  async getListUsers(req: Request): Promise<CommonResponse<UserResponse[]>> {
    const filteredParam = objectMapper<typeof req.query, UserEntity>(req.query, userEntity)
    const result = await this.useRepository.findAll(convertObjectToKeyValue(filteredParam))
    return {
      ...defaultCommonResponse,
      data: result.map((item) => objectMapper<UserEntity, UserResponse>(item, defaultUserResponse)),
    }
  }

  async insertAndUpdateUser(req: UserRequest, userId?: string): Promise<CommonResponse<null>> {
    const resultVal = validate<UserRequest>(req, UserValidatorSchema)
    if (resultVal.isError) {
      throw new InvalidRequest('invalid request', resultVal.error)
    }
    const request = objectMapper<UserRequest, UserEntity>(req, userEntity)
    if (userId) {
      const findUser = await this.useRepository.findOne({
        key: ID_FIELD_USER,
        value: String(userId),
      })
      if (!findUser) {
        throw new NotfoundException('not found user')
      }
    }
    const hashedPass = await hashPassword(process.env.DEFAULT_PASSWORD || '')
    await this.useRepository.insertAndUpdate(
      convertObjectToKeyValue({
        ...request,
        password: hashedPass,
        [ID_FIELD_USER]: userId ? userId : undefined,
      })
    )
    return {
      ...defaultCommonResponse,
      message: userId ? 'update success' : 'add success',
    }
  }

  async changeActive(id: string, isActive: boolean): Promise<CommonResponse<null>> {
    const findUser = await this.useRepository.findOne({ key: ID_FIELD_USER, value: String(id) })
    if (!findUser) {
      throw new NotfoundException('not found user')
    }
    await this.useRepository.insertAndUpdate(
      convertObjectToKeyValue({ ...findUser, isActive: isActive ? 1 : 0 })
    )
    return {
      ...defaultCommonResponse,
      message: isActive ? 'active success' : 'deactivated success',
    }
  }
}
