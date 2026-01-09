import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/user/entities/menu.entity';
import { Role } from 'src/user/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/user/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role, User, Department])],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
