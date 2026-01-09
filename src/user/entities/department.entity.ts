import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('sys_dept')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', default: 0 })
  parentId: number;
  // 虚拟字段，用于存储树结构
  children?: Department[];
  @Column({ comment: '部门名称' })
  name: string;

  @Column({ default: 0 })
  orderNum: number;

  // 仅作为代码层面的快捷查询，数据库不会生成外键
  @OneToMany(() => User, (user) => user.department, {
    createForeignKeyConstraints: false,
  })
  users: User[];
  // --- 新增：指向父级的关联 ---
  @ManyToOne(() => Department, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'parent_id' })
  parent: Department;
}
