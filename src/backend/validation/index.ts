import { validateFunction } from './type.validation'

export type ObjectValidator<T extends object> = {
  [key in keyof T]?: validateFunction
}

export const validate = <T extends object>(entity: T, validateObject: ObjectValidator<T>) => {
  let error: object = {}
  Object.keys(entity).map((key) => {
    error = { ...error, [key]: '' }
  })
  Object.keys(validateObject).forEach((item) => {
    if (validateObject[item as keyof typeof validateObject]) {
      error = {
        ...error,
        ...validateObject[item as keyof typeof validateObject]!(
          error as Record<keyof T, string>,
          entity[item as keyof T],
          item as keyof T
        ),
      }
    }
  })
  const isError: boolean =
    Object.keys(error).filter((keyError) => error[keyError as keyof typeof error])?.length > 0
      ? true
      : false
  return {
    error: error as Record<keyof T, string>,
    isError,
  }
}

export * from './IS_EMAIL'
export * from './IS_NUMBER'
export * from './IS_PASSWORD'
export * from './IS_PHONE'
export * from './IS_REQUIRED'
export * from './IS_USERNAME'
