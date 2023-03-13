import { isNumber } from '../inventory'
import { validateFunction } from './type.validation'

export const IS_NUMBER: validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  if (!isNumber(value)) {
    return { ...error, [key]: 'value must be number' }
  }
  return { ...error, [key]: '' }
}
