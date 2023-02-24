import { IConditionObject, IResAndEntity } from '@/src/shared'
import { Request } from 'express'
import { isBoolean, isNumber } from './../inventory/common.inventory'

export const defaultCommonResponse = {
  data: null,
  status: 200,
  message: '',
  isSuccess: true,
}

/*

  author: @ericchentch
  mapping query follow relation between res and entity
*/
export const mappingParams = (req: Request, mapList: IResAndEntity[]): IConditionObject[] => {
  const query = Object.keys(req.query)
  const validQuery = query.filter((queryKey) => mapList.find((item) => item.resKey === queryKey))
  return mapList
    .filter((item) => validQuery.includes(item.resKey))
    .filter((item) => convertValue(req.query[item.resKey], item.typeEntity) !== '')
    .map((item) => {
      return {
        key: item.entityKey,
        value: convertValue(req.query[item.resKey], item.typeEntity),
      }
    })
}

/*

  author: @ericchentch
  transfer type response to type entity
*/
const convertValue = (value: any, typeEntity: 'string' | 'date' | 'boolean' | 'number'): string => {
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
