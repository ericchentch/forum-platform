import { HttpException, HttpStatus } from '@nestjs/common'

export class UnauthorizeException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}
