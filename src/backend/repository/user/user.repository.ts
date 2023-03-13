import { Injectable } from '@nestjs/common'
import { userEntity } from '../../inventory'
import { BaseRepository } from '../base.repository'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super()
    this.table = 'user'
    this.clazz = userEntity
    this.fieldId = 'id'
    this.modifiedField = 'modified'
  }
}
