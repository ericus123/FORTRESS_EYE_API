import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { UserRole } from "../role/role.model";

export enum AccessRights {
  ADMIN = "ADMIN",
  USER = "USER",
}

@ObjectType()
@Table({
  timestamps: true,
  tableName: "User",
})
export class User extends Model<User> {
  @Field((type) => ID)
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id: number;

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
  @Column({ type: DataType.STRING })
  password: string;

  @Field()
  @Unique
  @Column({ type: DataType.STRING })
  email: string;

  @Field()
  @Column({ type: DataType.STRING })
  phoneNumber: string;

  @Field((type) => AccessRights)
  @Column({
    type: DataType.ENUM(...Object.values(AccessRights)),
    allowNull: false,
    defaultValue: AccessRights.USER,
  })
  accessRights: AccessRights;

  @Field()
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field()
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field((type) => [UserRole], { nullable: true })
  @BelongsToMany(() => UserRole, () => UserRole)
  roles: UserRole[];
}
