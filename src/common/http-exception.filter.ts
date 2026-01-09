// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
class ResponseDto<T> {
  status: number;
  message: string;
  data?: T;
}

@Catch() // 捕获所有异常
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // console.log(exception, '11@.com');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ResponseDto<any> = {
      status,
      message: exception.response?.message || exception.response || '网络错误',
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
