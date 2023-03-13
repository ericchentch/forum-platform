import { EMAIL_REGEX, PHONE_REGEX, USERNAME_REGEX } from '../constants'
import { isNumber } from '../inventory'

export type validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => Record<keyof T, string>

export const IS_EMAIL: validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  if (!newValue.match(EMAIL_REGEX)) {
    return { ...error, [key]: 'invalid email' }
  }
  return { ...error, [key]: '' }
}

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

export const IS_USERNAME: validateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  if (!newValue.match(USERNAME_REGEX)) {
    return { ...error, [key]: 'invalid username' }
  }
  return { ...error, [key]: '' }
}

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
