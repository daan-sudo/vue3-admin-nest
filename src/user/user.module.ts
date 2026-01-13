import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Department } from './entities/department.entity';
import { Menu } from './entities/menu.entity';
import { Role } from './entities/role.entity';
import { RedisModule } from 'src/redis/redis.module';
import { OssModule } from 'src/oss/oss.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Menu, Department]),
    RedisModule,
    OssModule,
  ],
  controllers: [UserController],
  // providers: [UserService, SeedService],
  providers: [UserService],
})
export class UserModule {}
