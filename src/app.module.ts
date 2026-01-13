import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Menu } from './user/entities/menu.entity';
import { Department } from './user/entities/department.entity';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './login.guard';
import { SystemModule } from './system/system.module';
import { OssModule } from './oss/oss.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'winston-daily-rotate-file';
import * as path from 'path';
import {
  utilities,
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonLogger,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';
import { CustomTypeOrmLogger } from './CustomTypeOrmLogger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 关键：设置为全局模块，其他地方直接用 ConfigService
      // envFilePath: ['.env.development', '.env'], // 指定读取的文件顺序
      envFilePath: [
        path.join(__dirname, `.env.${process.env.NODE_ENV}`),
        path.join(__dirname, '.env'),
      ],

      cache: true, // 提高性能，加载后会存入内存
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: 'daan',
        signOptions: {
          expiresIn: '30m',
        } as any,
      }),
    }),
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService, logger: WinstonLogger) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'vue3-nest-admin',
          // logger: new CustomTypeOrmLogger(logger),
          synchronize: false, // 作用: 每次应用启动时自动同步实体到数据库
          logging: false, // 打印sql语句
          entities: [User, Role, Menu, Department],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        level: 'debug',
        transports: [
          // new winston.transports.File({
          //   filename: `${process.cwd()}/log`,
          // }),
          new winston.transports.DailyRotateFile({
            // level: 'debug',
            // dirname: 'daily-log',
            // filename: 'log-%DATE%.log',
            // datePattern: 'YYYY-MM-DD',
            // maxSize: '100k',
            dirname: 'logs',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error', // 只有 error 级别才进这个文件
            maxSize: '20m',
            maxFiles: '14d',
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
          new winston.transports.Http({
            host: 'localhost',
            port: 3002,
            path: '/log',
          }),
        ],
      }),
    }),

    RedisModule,
    SystemModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: LoginGuard,
    },
  ],
})
export class AppModule {}
