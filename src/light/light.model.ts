import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import {
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
import { Camera } from "../camera/camera.model";

@ObjectType()
@InputType("ILight")
@Table({
  timestamps: true,
  tableName: "Light",
  omitNull: true,
  paranoid: true,
})
export class Light extends Model<Light> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  controlID?: string = uuidv4();

  @ForeignKey(() => Camera)
  @Field(() => Number)
  @Column({ type: DataType.INTEGER })
  cameraID: number;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  lightStatus: string;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  timestamp: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Field(() => Camera)
  camera: Camera;
}
