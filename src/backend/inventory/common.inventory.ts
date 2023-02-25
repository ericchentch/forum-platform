/*


  check boolean
  author: @ericchentch
*/
export const isBoolean = (val: any) => val === false || val === true
/*


  check number
  author: @ericchentch
*/
export const isNumber = (val: any) => !isNaN(val) && typeof val === 'number'
/*


  check date
  author: @ericchentch
*/
export const isValidDate = (date: any) => {
  return date && date.constructor === Date
}
/*


  convert date js to dateTime sql
  author: @ericchentch
*/
export const convertToDateTimeSql = (date: Date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export const defaultCommonResponse = {
  data: null,
  status: 200,
  message: '',
  isSuccess: true,
}
