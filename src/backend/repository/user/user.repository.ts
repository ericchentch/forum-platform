import { Injectable } from '@nestjs/common'
import { ID_FIELD_DEFAULT, ID_FIELD_USER } from '../../constants'
import { userEntity } from '../../inventory'
import { BaseRepository } from '../base.repository'
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super()
    this.table = 'user'
    this.clazz = userEntity
    this.fieldId = ID_FIELD_USER
    this.modifiedField = 'modified'
    this.ignoreFields = [ID_FIELD_DEFAULT]
  }
}
