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
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 关键：设置为全局模块，其他地方直接用 ConfigService
      // envFilePath: ['.env.development', '.env'], // 指定读取的文件顺序
      envFilePath: [path.join(__dirname, '.env')], //

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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'vue3-nest-admin',
      synchronize: true, // 作用: 每次应用启动时自动同步实体到数据库
      logging: false, // 打印sql语句
      entities: [User, Role, Menu, Department],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
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
