import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { UUIDV4 } from "sequelize";
import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Role } from "../role/role.model";

export enum PermissionName {
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  MANAGE_SYSTEM = "MANAGE_SYSTEM",
  CONTROL_LIGHTS = "CONTROL_LIGHTS",
  SCHEDULE_FUNCTIONALITY = "SCHEDULE_FUNCTIONALITY",
  RECEIVE_NOTIFICATIONS = "RECEIVE_NOTIFICATIONS",
  VIEW_STREAM = "VIEW_STREAM",
  MANAGE_REPORTS = "MANAGE_REPORTS",
  CONTROL_SYSTEM_BY_VOICE = "CONTROL_SYSTEM_BY_VOICE",
  MONITOR_TEMPERATURE_HUMIDITY = "MONITOR_TEMPERATURE_HUMIDITY",
  CONTROL_FANS = "CONTROL_FANS",
  PRESS_PANIC_BUTTON = "PRESS_PANIC_BUTTON",
  VIEW_USER_ACTIVITY_LOGS = "VIEW_USER_ACTIVITY_LOGS",
}

export const rolePermissions = {
  SUPER_ADMIN: [
    PermissionName.VIEW_DASHBOARD,
    PermissionName.MANAGE_SYSTEM,
    PermissionName.CONTROL_LIGHTS,
    PermissionName.SCHEDULE_FUNCTIONALITY,
    PermissionName.RECEIVE_NOTIFICATIONS,
    PermissionName.VIEW_STREAM,
    PermissionName.MANAGE_REPORTS,
    PermissionName.CONTROL_SYSTEM_BY_VOICE,
    PermissionName.MONITOR_TEMPERATURE_HUMIDITY,
    PermissionName.CONTROL_FANS,
    PermissionName.PRESS_PANIC_BUTTON,
    PermissionName.VIEW_USER_ACTIVITY_LOGS,
  ],
  ADMIN: [
    PermissionName.VIEW_DASHBOARD,
    PermissionName.CONTROL_LIGHTS,
    PermissionName.SCHEDULE_FUNCTIONALITY,
    PermissionName.RECEIVE_NOTIFICATIONS,
    PermissionName.VIEW_STREAM,
    PermissionName.MANAGE_REPORTS,
    PermissionName.CONTROL_SYSTEM_BY_VOICE,
    PermissionName.MONITOR_TEMPERATURE_HUMIDITY,
    PermissionName.CONTROL_FANS,
    PermissionName.PRESS_PANIC_BUTTON,
  ],
  DEFAULT: [
    PermissionName.VIEW_DASHBOARD,
    PermissionName.RECEIVE_NOTIFICATIONS,
    PermissionName.VIEW_STREAM,
    PermissionName.MONITOR_TEMPERATURE_HUMIDITY,
    PermissionName.CONTROL_FANS,
    PermissionName.PRESS_PANIC_BUTTON,
  ],
};

@InputType()
export class PermissionInput {
  @Unique
  @Field(() => String)
  @Column({
    type: DataType.ENUM(...Object.values(PermissionName)),
    unique: true,
  })
  permissionName: PermissionName;

  @Field(() => String, { nullable: true })
  @Column({ type: DataType.STRING })
  description?: string;
}
@ObjectType()
@InputType("IPermission")
@Table({
  timestamps: true,
  tableName: "Permission",
  omitNull: true,
  paranoid: true,
})
export class Permission extends Model<Permission> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();
  @Unique
  @Field(() => String)
  @Column({
    type: DataType.ENUM(...Object.values(PermissionName)),
    unique: true,
  })
  permissionName: PermissionName;

  @Field(() => String, { nullable: true })
  @Column({ type: DataType.STRING })
  description?: string;

  @BelongsToMany(() => Role, () => PermissionRole)
  roles: Role[];

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  deletedAt: Date;
}

@ObjectType()
@InputType("IPermissionRole")
@Table({
  timestamps: true,
  tableName: "PermissionRole",
  omitNull: true,
  paranoid: true,
})
export class PermissionRole extends Model<PermissionRole> {
  @Field((type) => ID)
  @Index
  @Unique
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @ForeignKey(() => Permission)
  @Column({ type: DataType.STRING, unique: false })
  permissionId: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING, unique: false })
  roleId: string;
}
