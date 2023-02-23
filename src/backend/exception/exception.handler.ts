import { CommonResponse } from '@/src/shared'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    this.logger.error(exception.getResponse().toString())
    const result: CommonResponse<null> = {
      data: null,
      status,
      message: exception.getResponse().toString(),
      isSuccess: false,
    }

    response.status(200).json(result)
  }
}
