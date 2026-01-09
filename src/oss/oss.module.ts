import { Global, Module } from '@nestjs/common';
import { OssService } from './oss.service';
import OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [
    OssService,
    {
      provide: 'OSS_CLIENT',
      async useFactory(configService: ConfigService) {
        const accessKeyId = configService.get('OSS_ACCESS_KEY_ID');
        const accessKeySecret = configService.get('OSS_ACCESS_KEY_SECRET');
        const clinet = new OSS({
          region: 'oss-cn-beijing',
          bucket: 'daan-pqf',
          accessKeyId: accessKeyId,
          accessKeySecret: accessKeySecret,
        });
        return clinet;
      },
      inject: [ConfigService], // 必须注入，否则会报读取 'get' 的 undefined 错误
    },
  ],
  exports: [OssService],
})
export class OssModule {}
