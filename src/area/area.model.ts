import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, Length } from "class-validator";
import { UUIDV4 } from "sequelize";
import {
  Column,
  DataType,
  Default,
  HasMany,
  HasOne,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Alarm } from "../alarm/alarm.model";
import { Light } from "../light/light.model";
import { Sensor } from "../sensor/sensor.model";

@ObjectType()
@InputType("IArea")
@Table({
  timestamps: true,
  tableName: "Area",
  omitNull: true,
  paranoid: true,
})
export class Area extends Model<Area> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(UUIDV4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @Field(() => String)
  @IsNotEmpty({ message: "Area name is required" })
  @Length(1, 30, { message: "Area name must be between 1 and 30 characters" })
  @Column({ type: DataType.STRING })
  name: string;

  @Field(() => Light, { nullable: true })
  @HasOne(() => Light)
  light: Light;

  @Field(() => Alarm, { nullable: true })
  @HasMany(() => Alarm)
  alarm: Alarm;

  @Field(() => Sensor, { nullable: true })
  @HasMany(() => Sensor)
  sensor: Sensor;

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
