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
  Unique,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Area } from "../area/area.model";
import { Camera } from "../camera/camera.model";

@ObjectType()
@InputType("IDoor")
@Table({
  timestamps: true,
  tableName: "Door",
  omitNull: true,
  paranoid: true,
})
export class Door extends Model<Door> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  id?: string = uuidv4();

  @ForeignKey(() => Camera)
  @Field(() => String, { nullable: true })
  @Column({ type: DataType.STRING })
  cameraID: string;

  @Unique
  @Field(() => String, { nullable: true })
  @ForeignKey(() => Area)
  @Column({ type: DataType.STRING })
  areaID: string;

  @Field(() => Area, { nullable: true })
  @BelongsTo(() => Area)
  area: Area;

  @Field(() => Boolean)
  @Default(() => false)
  @Column({ type: DataType.BOOLEAN })
  isLocked: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Field(() => Camera, { nullable: true })
  camera: Camera;
}
