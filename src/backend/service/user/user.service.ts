import { CommonResponse } from '@/src/shared'
import { UserResponse } from '@/src/shared/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { defaultCommonResponse, defaultUserResponse, userResEntity } from '../../inventory'
import { UserRepository } from '../../repository/user/user.repository'
import { mappingParams, objectMapper } from '../common.service'
import { UserEntity } from './../../repository/user/user.entity'

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private useRepository: UserRepository
  ) {}

  async getListUsers(req: Request): Promise<CommonResponse<UserResponse[]>> {
    const result = await this.useRepository.findAll(mappingParams(req, userResEntity))
    return {
      ...defaultCommonResponse,
      data: result.map((item) => objectMapper<UserEntity, UserResponse>(item, defaultUserResponse)),
    }
  }
}
