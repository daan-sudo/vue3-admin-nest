import { Inject, Injectable } from '@nestjs/common';
import OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
@Injectable()
export class OssService {
  @Inject('OSS_CLIENT')
  private ossClint: OSS;
  constructor() {}
  async upload(file: Express.Multer.File, folder: string = 'general') {
    // 生成唯一文件名防止覆盖
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const fullPath = `${folder}/${fileName}`;
    const result = await this.ossClint.put(fullPath, file.buffer);
    return result.url;
  }
}
