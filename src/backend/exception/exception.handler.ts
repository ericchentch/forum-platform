import { CommonResponse } from '@/src/shared'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Response } from 'express'

interface InvalidRequestExtends {
  error?: object
}
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException & InvalidRequestExtends, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    this.logger.error(exception.getResponse().toString())
    const result: CommonResponse<null> = {
      data: null,
      status,
      message: exception.getResponse().toString(),
      isSuccess: false,
      validateError: exception.error,
    }

    response.status(200).json(result)
  }
}
