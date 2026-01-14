import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
// @Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        console.log(
          configService.get('redis_server_host'),
          "configService.get('redis_server_host')",
        );
        const client = createClient({
          socket: {
            host: configService.get('redis_server_host'),
            port: 6379,
          },
          database: 0,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService], // 必须注入，否则会报读取 'get' 的 undefined 错误
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
