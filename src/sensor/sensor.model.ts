import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Area } from "../area/area.model";

export enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  MOTION = "MOTION",
}

export enum ActuatorType {
  LIGHT_CONTROL = "LIGHT_CONTROL",
  BUZZER_CONTROL = "BUZZER_CONTROL",
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
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  sensorID: number;

  @ForeignKey(() => Area)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  areaID: number;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  sensorName: string;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(SensorType)) })
  sensorType: SensorType;

  @Field(() => Number)
  @Column({ type: DataType.FLOAT })
  sensorValue: number;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @BelongsTo(() => Area)
  area: Area;
}
