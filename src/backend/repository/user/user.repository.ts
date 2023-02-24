import { Injectable } from '@nestjs/common'
import { BaseRepository } from '../base.repository'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  tableUser: string = 'user u'

  constructor() {
    super()
    this.table = this.tableUser
  }
}
