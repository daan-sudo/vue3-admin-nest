import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Role } from './role.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('sys_user')
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @Column({ unique: true, comment: '用户名' })
  @ApiProperty({ description: '用户名', example: 'pqf' })
  username: string;

  @Column({ select: false, comment: '密码' })
  @Exclude()
  @ApiHideProperty()
  password: string;
  @Column({ nullable: true, comment: '昵称' })
  @ApiProperty({ description: '昵称', example: '十一' })
  nickName: string;
  @Column({ default: 1, comment: '状态: 0禁用, 1正常' })
  @ApiProperty({ description: '状态', example: 1 })
  status: number;
  // 性别
  @Column({ default: 1, comment: '性别: 0女, 1男' })
  @ApiProperty({ description: '性别', example: 1 })
  sex: number;

  // --- 新增头像字段 ---
  @Column({
    nullable: true,
    comment: '用户头像地址',
    // default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', // 可以设置一个默认头像/
  })
  @ApiProperty({
    description: '用户头像地址',
    example: 'https://api.dicebear.com/7.x/avataaars/svg',
  })
  avatar: string;
  @Column({ nullable: true, name: 'dept_id', comment: '部门ID' })
  @ApiProperty({
    description: '部门ID',
    example: '1',
  })
  deptId: number;
  @Column({ nullable: true, comment: '手机号' })
  @ApiProperty({
    description: '手机号',
    example: '18888888888',
  })
  phone: string;
  // 个人简介
  @Column({ nullable: true, comment: '个人简介' })
  @ApiProperty({ description: '个人简介', example: '哈哈' })
  remark: string;
  @Column({ nullable: true, comment: '邮箱' })
  @ApiProperty({ description: '邮箱', example: '123456@qq.com' })
  email: string;
  @CreateDateColumn({ name: 'create_time' })
  @ApiProperty({ description: '创建时间', example: '2022-01-01 00:00:00' })
  createTime: Date;
  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
    comment: '修改时间',
  })
  updateTime: Date;
  // 逻辑关联：设置 createForeignKeyConstraints: false
  @ManyToOne(() => Department, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'dept_id' })
  @ApiProperty({ type: () => Department, description: '部门信息' })
  department: Department;

  @ManyToMany(() => Role, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ type: [Role], description: '角色列表' }) // ✅ 标注数组类型
  roles: Role[];
}
