import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Permission, PermissionRole } from "./permission.model";
import { PermissionService } from "./permission.service";

@Module({
  imports: [SequelizeModule.forFeature([Permission, PermissionRole])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
