import { Injectable } from '@nestjs/common'
import { executeQuery } from '../common.repository'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository {
  async getAllUser(): Promise<UserEntity[]> {
    const query = 'SELECT * FROM user'
    const result = await executeQuery(query)
    return result
  }
}
