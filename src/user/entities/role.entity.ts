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

@Entity('sys_role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色名称' })
  name: string;

  @Column({ unique: true, comment: '角色标识' })
  code: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：1正常，0停用' })
  status: number;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注' })
  remark: string;

  @Column({ type: 'int', default: 0, comment: '显示排序' })
  orderNum: number;

  @ManyToMany(() => Menu, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Menu[];

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
  @DeleteDateColumn({ name: 'deleted_at', select: false, comment: '删除时间' })
  deletedAt: Date; // 逻辑删除标识
}
