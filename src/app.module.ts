import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { TaskModule } from './modules/task/task.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [UserModule, RoleModule, TaskModule, PermissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
