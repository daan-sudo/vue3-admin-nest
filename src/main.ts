import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './common/format-response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('清风后台管理系统')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // 可选，仅作说明
        name: 'JWT', // 参数名称
        description: '请输入 Token',
        in: 'header', // Token 存放位置
      },
      'token', // 这里是一个自定义的 "安全协议 ID"，后面会用到
    )
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离 DTO 中未定义的属性
      transform: true, // 自动转换类型
      // forgetCodeAndMessage: false // 报错时返回详细信息
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
