import { hashPassword } from '@/src/libs'
import { CommonResponse } from '@/src/shared'
import { UserResponse } from '@/src/shared/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UserRequest } from '../../../shared/user.dto'
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

  async insertAndUpdateUser(req: UserRequest): Promise<CommonResponse<null>> {
    const resultVal = validate<UserRequest>(req, UserValidatorSchema)
    if (resultVal.isError) {
      throw new InvalidRequest('invalid request', resultVal.error)
    }
    const request = objectMapper<UserRequest, UserEntity>(req, userEntity)
    if (request['id']) {
      const findUser = await this.useRepository.findOne({ key: 'id', value: String(request['id']) })
      if (!findUser) {
        throw new NotfoundException('not found user')
      }
    }
    const hashedPass = await hashPassword(process.env.DEFAULT_PASSWORD || '')
    await this.useRepository.insertAndUpdate(
      convertObjectToKeyValue({ ...request, password: hashedPass })
    )
    return {
      ...defaultCommonResponse,
      message: request['id'] ? 'update success' : 'add success',
    }
  }

  async changeActive(id: string, isActive: boolean): Promise<CommonResponse<null>> {
    const findUser = await this.useRepository.findOne({ key: 'id', value: String(id) })
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
