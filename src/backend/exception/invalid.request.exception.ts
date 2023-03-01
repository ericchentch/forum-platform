import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidRequest extends HttpException {
  private error: object = {}
  constructor(message: string, error: object) {
    super(message, HttpStatus.BAD_REQUEST)
    this.error = error
  }
}
