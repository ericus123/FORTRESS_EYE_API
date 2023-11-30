import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import HashingService from "../crypto/hashing.service";
import { PermissionModule } from "../permission/permission.module";
import { User } from "../user/user.model";
import { Role } from "./role.model";
import { RoleService } from "./role.service";

@Module({
  imports: [PermissionModule, SequelizeModule.forFeature([Role, User])],
  providers: [RoleService, HashingService],
  exports: [RoleService],
})
export class RoleModule {}
