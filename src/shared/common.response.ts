export interface CommonResponse<T> {
  data: T | null
  status: number
  message: string
  isSuccess: boolean
  validateError?: object
}
