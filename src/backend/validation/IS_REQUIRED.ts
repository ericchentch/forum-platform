import { validateFunction } from './type.validation'

export const IS_REQUIRED: validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  return { ...error, [key]: '' }
}
