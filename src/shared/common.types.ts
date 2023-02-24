export interface IConditionObject {
  key: string
  value: string
}

export interface IResAndEntity {
  resKey: string
  entityKey: string
  typeEntity: 'string' | 'date' | 'boolean' | 'number'
}
