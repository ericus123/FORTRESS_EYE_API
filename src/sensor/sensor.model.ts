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

export enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  MOTION = "MOTION",
}

@ObjectType()
@InputType("ISensor")
@Table({
  timestamps: true,
  tableName: "Sensor",
  omitNull: true,
  paranoid: true,
})
export class Sensor extends Model<Sensor> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @ForeignKey(() => Area)
  @Field(() => String, { nullable: true })
  @Column({ type: DataType.STRING })
  areaID: string;

  @Field(() => String, { nullable: true })
  @Column({ type: DataType.STRING })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: DataType.ENUM(...Object.values(SensorType)) })
  type: SensorType;

  @Field(() => Number, { nullable: true })
  @Column({ type: DataType.FLOAT })
  value?: number;

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
