import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Default,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Event } from "../event/event.model";

@ObjectType()
@InputType("ICamera")
@Table({
  timestamps: true,
  tableName: "Camera",
  omitNull: true,
  paranoid: true,
})
export class Camera extends Model<Camera> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  cameraID?: string = uuidv4();

  @Field(() => String)
  @Column({ type: DataType.STRING })
  cameraName: string;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  ipAddress: string;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  location: string;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  cameraModel: string;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  status: string;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @HasMany(() => Event)
  events: Event[];
}
