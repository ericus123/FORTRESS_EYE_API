import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
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
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Area } from "../area/area.model";

@ObjectType()
@InputType("IFan")
@Table({
  timestamps: true,
  tableName: "Fan",
  omitNull: true,
  paranoid: true,
})
export class Fan extends Model<Fan> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @Field(() => String)
  @Column({ type: DataType.STRING })
  name?: string;

  @ForeignKey(() => Area)
  @Field(() => String, { nullable: true })
  @Column({ type: DataType.STRING })
  areaID: string;

  @Field(() => Boolean)
  @Default(() => false)
  @Column({ type: DataType.BOOLEAN })
  isOn: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Field(() => Area, { nullable: true })
  @BelongsTo(() => Area)
  area: Area;
}
