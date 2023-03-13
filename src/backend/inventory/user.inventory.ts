import { UserResponse } from '@/src/shared'
import { UserEntity } from '../repository/user/user.entity'

export const userEntity: UserEntity = {
  id: 0,
  userId: '',
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
  userId: '',
  name: '',
  username: '',
  phone: '',
  email: '',
  created: '',
  modified: '',
  isActive: true,
}
