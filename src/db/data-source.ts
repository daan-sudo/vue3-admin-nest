import { DataSource } from 'typeorm';

import { Role } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';

import { Department } from '../user/entities/department.entity';
import { Menu } from '../user/entities/menu.entity';

console.log(process.env);

export default new DataSource({
  type: 'mysql',
  host: `localhost`,
  port: 3306,
  username: `root`,
  password: `123456`,
  database: `vue3-nest-admin`,
  synchronize: false,
  logging: true,
  entities: [User, Role, Menu, Department],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
});
