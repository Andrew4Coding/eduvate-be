import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from '../utils/response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseUtil: ResponseUtil) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if ((res as any).message) {
        message = Array.isArray((res as any).message)
          ? (res as any).message.join('; ')
          : (res as any).message;
      }
    }

    const payload = this.responseUtil.response(
      {
        code: status,
        message: message,
      },
      { data: {} },
    );

    response.status(status).json(payload);
  }
}
