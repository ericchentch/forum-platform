import { PHONE_REGEX } from '../constants'
import { validateFunction } from './type.validation'

export const IS_PHONE: validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  if (!newValue.match(PHONE_REGEX)) {
    return { ...error, [key]: 'invalid phone' }
  }
  return { ...error, [key]: '' }
}
