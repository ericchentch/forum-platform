import { Injectable } from '@nestjs/common'
import { BaseRepository } from '../base.repository'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  tableUser: string = 'user u'
  userEntity: UserEntity = {
    id: 0,
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    created: new Date(),
    modified: new Date(),
    isActive: 0,
  }

  constructor() {
    super()
    this.table = this.tableUser
    this.clazz = this.userEntity
  }
}
