import { IResAndEntity, UserResponse } from '@/src/shared'

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

export const defaultUserResponse: UserResponse = {
  id: '',
  name: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  created: '',
  modified: '',
  isActive: true,
}
