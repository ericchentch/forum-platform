import { IResAndEntity, UserResponse } from '@/src/shared'
import { UserEntity } from '../repository/user/user.entity'

export const userResEntity: IResAndEntity[] = [
  {
    resKey: 'id',
    entityKey: 'id',
    typeEntity: 'number',
  },
  {
    resKey: 'isActive',
    entityKey: 'isActive',
    typeEntity: 'number',
  },
]

export const userEntity: UserEntity = {
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

export const defaultUserResponse: UserResponse = {
  id: '',
  name: '',
  username: '',
  phone: '',
  email: '',
  created: '',
  modified: '',
  isActive: true,
}
