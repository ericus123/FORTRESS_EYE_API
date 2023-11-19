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

export enum ActuatorType {
  LIGHT_CONTROL = "LIGHT_CONTROL",
  BUZZER_CONTROL = "BUZZER_CONTROL",
}

@ObjectType()
@InputType("IActuator")
@Table({
  timestamps: true,
  tableName: "Actuator",
  omitNull: true,
  paranoid: true,
})
export class Actuator extends Model<Actuator> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  actuatorID: number;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  actuatorName: string;

  @ForeignKey(() => Area)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  areaID: number;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(ActuatorType)) })
  actuatorType: ActuatorType;

  @Field(() => Boolean)
  @Column({ type: DataType.BOOLEAN })
  actuatorStatus: boolean;

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
