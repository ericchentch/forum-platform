import { formatDate } from '@/src/libs'
import { IConditionObject, IResAndEntity } from '@/src/shared'
import { Request } from 'express'
import { isBoolean, isNumber, isValidDate } from './../inventory/common.inventory'

/*

  author: @ericchentch
  mapping query follow relation between res and entity
*/
export const mappingParams = (req: Request, mapList: IResAndEntity[]): IConditionObject[] => {
  const query = Object.keys(req.query)
  const validQuery = query.filter((queryKey) => mapList.find((item) => item.resKey === queryKey))
  return mapList
    .filter((item) => validQuery.includes(item.resKey))
    .filter((item) => paramsResToEnt(req.query[item.resKey], item.typeEntity) !== '')
    .map((item) => {
      return {
        key: item.entityKey,
        value: paramsResToEnt(req.query[item.resKey], item.typeEntity),
      }
    })
}

/*

  author: @ericchentch
  transfer type response to type entity
*/
const paramsResToEnt = (
  value: any,
  typeEntity: 'string' | 'date' | 'boolean' | 'number'
): string => {
  if (typeEntity === 'string' || typeEntity === 'date') {
    return String(value)
  }
  if (typeEntity === 'number' && isBoolean(Boolean(value))) {
    return Boolean(value) ? '1' : '0'
  }
  if (typeEntity === 'number' && isNumber(value)) {
    return String(value)
  }
  return ''
}

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
  if (targetType === 'string') {
    String(value)
  }
  return String(value)
}
