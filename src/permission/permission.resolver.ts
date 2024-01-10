import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { Permission } from "./permission.model";
import { PermissionService } from "./permission.service";

@UseGuards(AuthGuard)
@Roles(RoleName.SUPER_ADMIN)
@Resolver("PermissionResolver")
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}
  @Query(() => Permission, { name: "GetPermission" })
  async getPermission(@Args("id") id: string): Promise<Permission> {
    return this.permissionService.getPermission({ type: "id", value: id });
  }

  @Query(() => [Permission], { name: "GetPermissions" })
  async getPermissions(): Promise<Permission[]> {
    return this.permissionService.getPermissions();
  }

  @Mutation(() => Permission, { name: "AddPermission" })
  async addPermission(
    @Args("permission") permission: Permission,
  ): Promise<Permission> {
    return this.permissionService.addPermission(permission);
  }

  @Mutation(() => Permission, { name: "UpdatePermission" })
  async updatePermission(
    @Args("permission") permission: Permission,
    @Args("id") id: string,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(permission, id);
  }

  @Mutation(() => Boolean, { name: "DeletePermission" })
  async deletePermission(@Args("id") id: string): Promise<boolean> {
    return this.permissionService.deletePermission(id);
  }
}
