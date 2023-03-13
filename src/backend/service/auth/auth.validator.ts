import { LoginRequest, RegisterRequest } from '@/src/shared'
import { IS_EMAIL, IS_PHONE, IS_REQUIRED, ObjectValidator } from './../../validation/index'

export const LoginValidateSchema: ObjectValidator<LoginRequest> = {
  username: IS_REQUIRED,
  password: IS_REQUIRED,
}

export const RegisterValidateSchema: ObjectValidator<RegisterRequest> = {
  username: IS_REQUIRED,
  password: IS_REQUIRED,
  name: IS_REQUIRED,
  email: IS_EMAIL,
  phone: IS_PHONE,
}
