import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { assignUUID } from "../helpers";
import { Permission, rolePermissions } from "../permission/permission.model";
import { PermissionService } from "../permission/permission.service";
import { User } from "../user/user.model";
import {
  AssignRoleInput,
  Role,
  RoleInput,
  RoleName,
  roleDescriptions,
} from "./role.model";

@Injectable()
export class RoleService {
  logger = new Logger("RoleService");
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    private readonly permissionService: PermissionService,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    (async () => {
      try {
        await this.initializeRolesAndPermissions();
      } catch (error) {
        throw new Error(error);
      }
    })();
  }

  async deleteRole(id: string): Promise<boolean> {
    try {
      const role = await this.getRole({ type: "id", value: id });
      await role.destroy();
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateRole(role: RoleInput, id: string): Promise<Role> {
    try {
      const _role = await this.getRole({ type: "id", value: id });
      return await _role.update(role);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRole({
    type,
    value,
  }: {
    type: "id" | "roleName";
    value: string;
  }): Promise<Role> {
    try {
      const _role =
        type === "id"
          ? await this.roleModel.findByPk(value, {
              include: [
                {
                  model: Permission,
                  attributes: ["permissionName", "description"],
                },
              ],
            })
          : await this.roleModel.findOne({
              where: {
                roleName: value,
              },
              include: [
                {
                  model: Permission,
                  attributes: ["permissionName", "description"],
                },
              ],
            });

      if (!_role) {
        throw new NotFoundException("Role not found");
      }

      return _role;
    } catch (error) {
      throw new NotFoundException("Role not found");
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      return await this.roleModel.findAll({
        include: [
          {
            model: Permission,
            attributes: ["permissionName", "description"],
          },
        ],
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addRole(role: RoleInput): Promise<Role> {
    try {
      return await this.roleModel.create(assignUUID(role));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async initializeRolesAndPermissions(): Promise<void> {
    try {
      await this.initializeRoles();
      await this.permissionService.initializePermissions();

      const roles = await this.getRoles();

      for (const role of roles) {
        const { id, roleName } = role;
        await this.assignPermissions({ roleName, roleId: id });
      }

      await this.initializeSuperAdmin();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRoleByName(roleName: string): Promise<Role> {
    try {
      return await this.roleModel.findOne({
        where: {
          roleName,
        },
      });
    } catch (error) {
      throw new NotFoundException("Role not found");
    }
  }

  private async assignPermissions({
    roleName,
    roleId,
  }: {
    roleName: RoleName;
    roleId: string;
  }): Promise<void> {
    try {
      const permissions = await this.permissionService.getPermissions();

      if (rolePermissions[roleName] != undefined) {
        const includedPermissions = permissions?.filter((p) =>
          rolePermissions[roleName].includes(p?.permissionName),
        );

        includedPermissions?.map(async (ip) => {
          await this.permissionService.addPermissionRole({
            roleId,
            permissionId: ip?.id,
          });
        });
      }

      this.logger.debug("Initialized permissions");
    } catch (error) {
      throw new Error(error);
    }
  }

  async initializeRoles(): Promise<void> {
    try {
      const rolesNames = Object.values(RoleName);

      for (const roleName of rolesNames) {
        const existingRole = await this.getRoleByName(roleName);

        if (!existingRole) {
          await this.addRole({
            roleName,
            description: roleDescriptions[roleName],
          });

          this.logger.debug(`New role ${roleName} added!`);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async assigUserRole(input: AssignRoleInput): Promise<boolean> {
    try {
      const { email, roleName } = input;

      const user = await this.userModel.findOne({
        where: {
          email,
        },
        include: [
          {
            model: Role,
            attributes: ["roleName"],
          },
        ],
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      if (user.role.roleName === roleName) {
        throw new Error("User already has the same role");
      }
      const role = await this.getRole({ type: "roleName", value: roleName });
      user.roleId = role.id;
      await user.save();

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async initializeSuperAdmin() {
    try {
      const {
        SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_FIRSTNAME,
        SUPER_ADMIN_LASTNAME,
        SUPERA_ADMIN_PASSWORD,
      } = process.env;

      const existing = await User.findOne({
        where: {
          email: SUPER_ADMIN_EMAIL,
        },
      });

      if (!existing) {
        const role = await this.getRole({
          type: "roleName",
          value: RoleName.SUPER_ADMIN,
        });

        await User.create({
          email: SUPER_ADMIN_EMAIL,
          firstName: SUPER_ADMIN_FIRSTNAME,
          lastName: SUPER_ADMIN_LASTNAME,
          password: SUPERA_ADMIN_PASSWORD,
          roleId: role.id,
        });

        this.logger.debug("Initialized a superAdmin user");
      }
    } catch (error) {
      this.logger.error("Error while initializing a superAdmin");
      throw new Error(error);
    }
  }
}
