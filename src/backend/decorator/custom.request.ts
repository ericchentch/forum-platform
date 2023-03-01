import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { PREFIX_TOKEN } from '../constants'
import { UnauthorizeException } from '../exception/unauthorize.exception'
import { validateToken } from './../../libs/jwt.function'

export const CustomRequest = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const token = request.headers.token
  if (!token) {
    throw new UnauthorizeException('unauthorized')
  }
  try {
    const prefix = token.slice(0, 7)
    if (prefix !== PREFIX_TOKEN) {
      throw new UnauthorizeException('unauthorized')
    }
    const content = validateToken(token.slice(7))
    return request
  } catch (error: any) {
    throw new UnauthorizeException(error.message)
  }
})
