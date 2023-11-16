import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, DataType } from "sequelize-typescript";

@ObjectType()
@InputType("InputArea")
export class AreaInput {
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
