import { formatDate } from '@/src/libs'
import { CommonResponse } from '@/src/shared'
import { UserResponse } from '@/src/shared/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from '../../repository/user/user.repository'
import { defaultCommonResponse } from '../common.service'

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private useRepository: UserRepository
  ) {}

  async getListUsers(): Promise<CommonResponse<UserResponse[]>> {
    const result = await this.useRepository.findAll([])
    return {
      ...defaultCommonResponse,
      data: result.map((item) => {
        return {
          id: item.id.toString(),
          name: item.name,
          username: item.username,
          password: item.password,
          phone: item.phone,
          email: item.email,
          created: formatDate(item.created, '-'),
          modified: item.modified ? formatDate(item.modified, '-') : '',
          isActive: item.isActive === 1 ? true : false,
        }
      }),
    }
  }
}
