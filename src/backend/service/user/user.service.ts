import { CommonResponse } from '@/src/shared'
import { UserResponse } from '@/src/shared/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { defaultCommonResponse, defaultUserResponse, userEntity } from '../../inventory'
import { UserRepository } from '../../repository/user/user.repository'
import { convertObjectToKeyValue, objectMapper } from '../common.service'
import { UserRequest } from './../../../shared/user.dto'
import { UserEntity } from './../../repository/user/user.entity'

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

  async insertAndUpdateUser(req: Request): Promise<CommonResponse<null>> {
    const request = objectMapper<UserRequest, UserEntity>(req.body, userEntity)
    await this.useRepository.insertAndUpdate(convertObjectToKeyValue(request))
    return {
      ...defaultCommonResponse,
      message: request['id'] ? 'update success' : 'add success',
    }
  }
}
