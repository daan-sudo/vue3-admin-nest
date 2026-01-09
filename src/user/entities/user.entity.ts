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

@Entity('sys_user')
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: number;

  @Column({ unique: true, comment: '用户名' })
  username: string;

  @Column({ select: false, comment: '密码' })
  password: string;
  @Column({ nullable: true, comment: '昵称' })
  nickName: string;
  @Column({ default: 1, comment: '状态: 0禁用, 1正常' })
  status: number;
  // 性别
  @Column({ default: 1, comment: '性别: 0女, 1男' })
  sex: number;

  // --- 新增头像字段 ---
  @Column({
    nullable: true,
    comment: '用户头像地址',
    // default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', // 可以设置一个默认头像/
  })
  avatar: string;
  @Column({ nullable: true, name: 'dept_id', comment: '部门ID' })
  deptId: number;
  @Column({ nullable: true, comment: '手机号' })
  phone: string;
  // 个人简介
  @Column({ nullable: true, comment: '个人简介' })
  remark: string;
  @Column({ nullable: true, comment: '邮箱' })
  email: string;
  @CreateDateColumn({ name: 'create_time' })
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
  department: Department;

  @ManyToMany(() => Role, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
