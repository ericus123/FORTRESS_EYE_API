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

  @Field(() => Number)
  @Column({ type: DataType.INTEGER })
  eventID: number;

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

  @HasMany(() => Event)
  event: Event;
}
