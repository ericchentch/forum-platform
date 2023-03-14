import { formatDate } from '@/src/libs'
import { CommonResponse, IConditionObject } from '@/src/shared'
import { defaultCommonResponse, isNumber, isValidDate } from './../inventory/common.inventory'

/*

  author: @ericchentch
  convert value to response
*/
export const objectMapper = <T extends {}, E extends {}>(source: T, target: E): any => {
  const soKeys = Object.keys(source)
  const taKeys = Object.keys(target)
  let result = {}
  soKeys.forEach((keySource) => {
    taKeys.forEach((keyTarget) => {
      if (keySource === keyTarget) {
        result = {
          ...result,
          [keyTarget]: mapperConvertValue(
            source[keySource as keyof typeof source],
            typeof target[keyTarget as keyof typeof target]
          ),
        }
      }
    })
  })
  return result
}

/*

  author: @ericchentch
  switch value for mapper
*/
export const mapperConvertValue = (value: any, targetType: any): any => {
  if (!value) {
    switch (targetType) {
      case 'string':
        return ''
      case 'number':
        return 0
      case 'boolean':
        return false
    }
  }
  if (typeof value === targetType) {
    return value
  }
  if (isValidDate(value) && targetType === 'string') {
    return formatDate(value, '-')
  }
  if (isNumber(value) && targetType === 'boolean') {
    return Number(value) === 1
  }
  if (typeof value === 'string' && targetType === 'number' && isNumber(value)) {
    return Number(value)
  }
  if (targetType === 'string') {
    return String(value)
  }
  return 'error'
}

/*
  author: @ericchentch
  switch value for mapper
*/
export const convertObjectToKeyValue = (source: object): IConditionObject[] => {
  const keys = Object.keys(source)
  return keys
    .map((key) => {
      return {
        key,
        value: String(source[key as keyof typeof source]),
      }
    })
    .filter((item) => item.value !== 'error')
}

/*
  author: @ericchentch
  render success response
*/
export const renderSuccessResponse = <T>(
  extendValue: Partial<CommonResponse<T>>
): CommonResponse<T> => {
  return { ...defaultCommonResponse, ...extendValue }
}
