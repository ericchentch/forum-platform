/*


  check boolean
  author: @ericchentch
*/
export const isBoolean = (val: any) => val === false || val === true
/*


  check number
  author: @ericchentch
*/
export const isNumber = (val: any) => !isNaN(val)

/*


  check date
  author: @ericchentch
*/
export const isValidDate = (date: any) => {
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)
}

export const defaultCommonResponse = {
  data: null,
  status: 200,
  message: '',
  isSuccess: true,
}
