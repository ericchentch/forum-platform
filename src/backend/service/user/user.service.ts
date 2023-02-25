import { CommonResponse } from '@/src/shared'
import { UserResponse } from '@/src/shared/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { InvalidParam, NotfoundException } from '../../exception'
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
    if (request['id']) {
      const findUser = await this.useRepository.findOne({ key: 'id', value: request['id'] })
      if (!findUser) {
        throw new NotfoundException('not found user')
      }
    }
    await this.useRepository.insertAndUpdate(convertObjectToKeyValue(request))
    return {
      ...defaultCommonResponse,
      message: request['id'] ? 'update success' : 'add success',
    }
  }

  async changeActive(req: Request, isActive: boolean): Promise<CommonResponse<null>> {
    if (!req.query['id']) {
      throw new InvalidParam('not found param id')
    }
    const findUser = await this.useRepository.findOne({ key: 'id', value: String(req.query['id']) })
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
