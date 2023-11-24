import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { assignUUID } from "../helpers";
import {
  Permission,
  PermissionInput,
  PermissionName,
  PermissionRole,
} from "./permission.model";

@Injectable()
export class PermissionService {
  logger = new Logger("Permission Service");
  constructor(
    @InjectModel(Permission)
    private readonly permissionModel: typeof Permission,
    @InjectModel(PermissionRole)
    private readonly permissionRoleModel: typeof PermissionRole,
  ) {}

  async deletePermission(id: string): Promise<boolean> {
    try {
      const permission = await this.getPermission({
        type: "id",
        value: id,
      });
      await permission.destroy();
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePermission(
    permission: PermissionInput,
    id: string,
  ): Promise<Permission> {
    try {
      const _role = await this.getPermission({ type: "id", value: id });
      return await _role.update(permission);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPermission({
    type,
    value,
  }: {
    type: "id" | "permissionName";
    value: string;
  }): Promise<Permission> {
    try {
      const _permission =
        (await type) === "id"
          ? this.permissionModel.findByPk(value)
          : this.permissionModel.findOne({
              where: {
                permissionName: value,
              },
            });

      if (!_permission) {
        throw new NotFoundException("Permission not found");
      }
      return _permission;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getPermissions(): Promise<Permission[]> {
    try {
      return await this.permissionModel.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addPermission(permission: PermissionInput): Promise<Permission> {
    try {
      return await this.permissionModel.create(assignUUID(permission));
    } catch (error) {
      this.logger.debug("New permission added");
      throw new BadRequestException(error);
    }
  }

  async addPermissionRole({
    roleId,
    permissionId,
  }: {
    roleId: string;
    permissionId: string;
  }): Promise<PermissionRole> {
    try {
      const existing = await this.permissionRoleModel.findOne({
        where: {
          roleId,
          permissionId,
        },
      });

      if (!existing) {
        return await this.permissionRoleModel.create({
          roleId,
          permissionId,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async initializePermissions(): Promise<void> {
    try {
      const permissionNames = Object.values(PermissionName);

      permissionNames?.map(async (permissionName) => {
        const existingPermission = await this.getPermission({
          type: "permissionName",
          value: permissionName,
        });

        if (!existingPermission) {
          await this.addPermission({
            permissionName,
          });
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
