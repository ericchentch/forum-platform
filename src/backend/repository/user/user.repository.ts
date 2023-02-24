import { Injectable } from '@nestjs/common'
import { userEntity } from '../../inventory'
import { BaseRepository } from '../base.repository'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  tableUser: string = 'user'

  constructor() {
    super()
    this.table = this.tableUser
    this.clazz = userEntity
  }
}
