import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsPhoneNumber, IsUrl, Length } from "class-validator";
import { UUIDV4 } from "sequelize";
import {
  BelongsTo,
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

export enum AccessRights {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

@ObjectType()
@InputType("IUser")
@Table({
  timestamps: true,
  tableName: "User",
  omitNull: true,
  paranoid: true,
})
export class User extends Model<User> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @Field({ nullable: true })
  @IsUrl({}, { message: "Invalid URL format for avatar" })
  @Column({ type: DataType.STRING })
  avatar: string;

  @Field()
  @Length(1, 255, {
    message: "First name must be between 1 and 255 characters",
  })
  @Column({ type: DataType.STRING })
  firstName: string;

  @Field()
  @Length(1, 255, { message: "Last name must be between 1 and 255 characters" })
  @Column({ type: DataType.STRING })
  lastName: string;

  @Field({ nullable: true })
  @Unique
  @Length(3, 10, { message: "Username must be between 1 and 20 characters" })
  @Column({ type: DataType.STRING })
  username: string;

  @Field({ nullable: true })
  @Length(10, 255, { message: "Bio must be between 1 and 255 characters" })
  @Column({ type: DataType.STRING })
  bio: string;

  @Field()
  @Column({ type: DataType.STRING })
  password: string;

  @Field({ nullable: true })
  @Unique
  @IsEmail({}, { message: "Invalid email address" })
  @Column({ type: DataType.STRING })
  email: string;

  @Field({ nullable: true })
  @IsPhoneNumber(null, { message: "Invalid phone number" })
  @Length(1, 15, {
    message: "Phone number must be between 1 and 15 characters",
  })
  @Column({ type: DataType.STRING })
  phoneNumber: string;

  @Field((type) => String)
  @Default(() => AccessRights.USER)
  @Column({
    type: DataType.ENUM(...Object.values(AccessRights)),
    allowNull: false,
    defaultValue: AccessRights,
  })
  accessRights: AccessRights;

  @Field()
  @Default(() => false)
  @Column({ type: DataType.BOOLEAN })
  isVerified: boolean;

  @Field()
  @Default(() => false)
  @Column({ type: DataType.BOOLEAN })
  isComplete: boolean;

  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING })
  roleId: string;

  @Field(() => Role, { nullable: true })
  @BelongsTo(() => Role)
  role: Role;

  @Field()
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field()
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: DataType.DATE })
  deletedAt?: Date;
}
