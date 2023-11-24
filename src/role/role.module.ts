import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PermissionModule } from "../permission/permission.module";
import { User } from "../user/user.model";
import { Role } from "./role.model";
import { RoleService } from "./role.service";

@Module({
  imports: [PermissionModule, SequelizeModule.forFeature([Role, User])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
