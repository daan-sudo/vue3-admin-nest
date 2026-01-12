// // src/common/filters/http-exception.filter.ts
// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { ResponseVo } from './vo/response.vo';

// @Catch() // 捕获所有异常
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     // console.log(exception, '11@.com');
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     // const request = ctx.getRequest<Request>();
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const errorResponse: ResponseVo<any> = {
//       code: status,
//       message: exception.response?.message || exception.response || '网络错误',
//       data: null,
//     };

//     response.status(status).json(errorResponse);
//   }
// }
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express'; // 记得引入 Request
import { ResponseVo } from './vo/response.vo';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // 创建一个专门用于系统错误的日志实例
  private readonly logger = new Logger('SystemError');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>(); // 获取请求对象

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 1. 提取详细的上下文信息
    const { method, url, query, body, params } = request;
    const ip =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const userAgent = request.headers['user-agent'];
    const now = new Date().toISOString();

    // 2. 构造错误消息
    const message =
      exception.response?.message ||
      exception.response ||
      exception.message ||
      '网络错误';

    // 3. 记录到 Winston (error.log)
    // 我们将所有的上下文信息转成 JSON 字符串，方便在日志文件中通过搜索 IP 或 URL 快速定位
    this.logger.error(
      `[${method}] ${url} - IP: ${ip} - Time: ${now}`,
      JSON.stringify({
        ip,
        method,
        url,
        // userAgent,
        // params,
        query,
        // body: method !== 'GET' ? body : undefined, // GET 请求通常不记录 Body
        // response: message,
        stack: exception instanceof Error ? exception.stack : 'No stack trace',
      }),
    );

    const errorResponse: ResponseVo<any> = {
      code: status,
      message: Array.isArray(message) ? message[0] : message, // 处理 ValidationPipe 返回的数组格式
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
