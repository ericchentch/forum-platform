import { decodeBase64 } from '@/src/libs'
import { PASSWORD_REGEX } from '../constants'
import { validateFunction } from './type.validation'

export const IS_PASSWORD: validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  const rawPassword = decodeBase64(newValue)
  if (!rawPassword.match(PASSWORD_REGEX)) {
    return { ...error, [key]: 'password must pass condition' }
  }
  return { ...error, [key]: '' }
}
