import { UserRequest } from '@/src/shared'
import {
  IS_EMAIL,
  IS_PHONE,
  IS_REQUIRED,
  IS_USERNAME,
  ObjectValidator,
} from './../../validation/index'
export const UserValidatorSchema: ObjectValidator<UserRequest> = {
  name: IS_REQUIRED,
  username: IS_USERNAME,
  phone: IS_PHONE,
  email: IS_EMAIL,
}
