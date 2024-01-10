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
import { Event } from "../event/event.model";

@ObjectType()
@InputType("IImage")
@Table({
  timestamps: true,
  tableName: "Image",
  omitNull: true,
  paranoid: true,
})
export class Image extends Model<Image> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING })
  imageID?: string = uuidv4();

  @Field(() => String)
  @ForeignKey(() => Event)
  @Column({ type: DataType.STRING })
  eventID: string;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  imageURL: string;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Field(() => Event)
  @BelongsTo(() => Event)
  event: Event;
}
