import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { Camera } from "../camera/camera.model";
import { Image } from "../image/image.model";

@ObjectType()
@InputType("IEvent")
@Table({
  timestamps: true,
  tableName: "Event",
  omitNull: true,
  paranoid: true,
})
export class Event extends Model<Event> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  eventID?: string = uuidv4();

  @ForeignKey(() => Camera)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  cameraID: number;

  @Field()
  @Column({ type: DataType.STRING })
  eventType: string;

  @Field()
  @Column({ type: DataType.DATE })
  timestamp: Date;

  @Field()
  @Column({ type: DataType.TEXT })
  eventDetails: string;

  @BelongsTo(() => Camera)
  camera: Camera;

  @HasMany(() => Image)
  images: Image[];

  @Field()
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field()
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: DataType.DATE })
  deletedAt?: Date;
}
