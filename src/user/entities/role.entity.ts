import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('sys_role')
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id', example: 1 })
  id: number;
  @ApiProperty({ description: '角色名称', example: '管理员' })
  @Column({ comment: '角色名称' })
  name: string;

  @Column({ unique: true, comment: '角色标识' })
  @ApiProperty({ description: '角色标识', example: 'admin' })
  code: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1正常，0停用' })
  @ApiProperty({ description: '状态：1正常，0停用', example: 1 })
  status: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注' })
  @ApiProperty({ description: '备注', example: '备注' })
  remark: string;

  @Column({ type: 'int', default: 0, comment: '显示排序' })
  @ApiProperty({ description: '显示排序', example: 1 })
  orderNum: number;

  @ManyToMany(() => Menu, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ description: '权限列表' })
  menus: Menu[];

  @CreateDateColumn({ comment: '创建时间' })
  @ApiProperty({ description: '创建时间', example: '2021-01-01 00:00:00' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @ApiProperty({ description: '更新时间', example: '2021-01-01 00:00:00' })
  updateTime: Date;

  @ApiHideProperty()
  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', select: false, comment: '删除时间' })
  deletedAt: Date; // 逻辑删除标识
}
