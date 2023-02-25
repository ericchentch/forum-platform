import { HttpException, HttpStatus } from '@nestjs/common'

export class NotfoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND)
  }
}
