import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('sys_menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', default: 0, comment: '父级ID' })
  parentId: number;

  @Column({ comment: '菜单名称' })
  name: string;

  @Column({ comment: '类型: 1目录, 2菜单, 3按钮' })
  type: number;

  @Column({ nullable: true, comment: '权限标识' })
  permission: string;

  @Column({ nullable: true })
  path: string;
  @Column({ nullable: true })
  icon: string;
  @Column({ default: 0 })
  orderNum: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;
  children?: Menu[];
  @DeleteDateColumn({ select: false }) // 查询时默认排除此字段
  deletedAt: Date; // 记录删除时间，不为空则表示已删除
}
