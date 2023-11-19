import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "../user/user.model";

export enum ThemeSelection {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export enum DashboardLayout {
  STANDARD = "STANDARD",
  CUSTOM = "CUSTOM",
}

@ObjectType()
@InputType("IUserPreference")
@Table({
  timestamps: true,
  tableName: "UserPreference",
  omitNull: true,
  paranoid: true,
})
export class UserPreferences extends Model<UserPreferences> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  userPreferencesID: number;

  @ForeignKey(() => User)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  userID: number;

  @Field(() => Boolean)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  muteNotifications: boolean;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(ThemeSelection)) })
  themeSelection: ThemeSelection;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(DashboardLayout)) })
  dashboardLayout: DashboardLayout;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Field(() => User)
  user: User;
}
