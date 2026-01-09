import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './common/format-response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离 DTO 中未定义的属性
      transform: true, // 自动转换类型
      // forgetCodeAndMessage: false // 报错时返回详细信息
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
