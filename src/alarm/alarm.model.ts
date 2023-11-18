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
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@ObjectType()
@InputType("IAlarm")
@Table({})
export class Alarm extends Model<Alarm> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @Field(() => String)
  @Column({ type: DataType.STRING })
  name: string;

  @Field({ nullable: true })
  @Column({ type: DataType.DATE })
  createdAt?: Date;

  @Field({ nullable: true })
  @Column({ type: DataType.DATE })
  updatedAt?: Date;

  @Field({ nullable: true })
  @Column({ type: DataType.DATE })
  deletedAt?: Date;
}
