import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { UUIDV4 } from "sequelize";
import {
  Column,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

export enum AccessRights {
  ADMIN = "ADMIN",
  USER = "USER",
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

  @Field()
  @Column({ type: DataType.STRING })
  avatar: string;

  @Field()
  @Column({ type: DataType.STRING })
  firstName: string;

  @Field()
  @Column({ type: DataType.STRING })
  lastName: string;

  @Field()
  @Unique
  @Column({ type: DataType.STRING })
  username: string;

  @Field()
  @Unique
  @Column({ type: DataType.STRING })
  bio: string;

  @Field()
  @Column({ type: DataType.STRING })
  password: string;

  @Field()
  @Unique
  @Column({ type: DataType.STRING })
  email: string;

  @Field()
  @Column({ type: DataType.STRING })
  phoneNumber: string;

  // @Field((type) => AccessRights)
  // @Column({
  //   type: DataType.ENUM(...Object.values(AccessRights)),
  //   allowNull: false,
  //   defaultValue: AccessRights.USER,
  // })
  // accessRights: AccessRights;

  @Field()
  @Default(() => false)
  @Column({ type: DataType.BOOLEAN })
  verified: boolean;

  @Field()
  @Default(() => false)
  @Column({ type: DataType.BOOLEAN })
  deleted: boolean;

  @Field()
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field()
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
