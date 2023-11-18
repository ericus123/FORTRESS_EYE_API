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
import { Event } from "../event/event.model";
import { User } from "../user/user.model";

export enum NotificationType {
  SMS = "SMS",
  PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
  WHATSAPP = "WHATSAPP",
}

export enum NotificationReadStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}

@ObjectType()
@InputType("INotification")
@Table({
  timestamps: true,
  tableName: "Notification",
  omitNull: true,
  paranoid: true,
})
export class Notification extends Model<Notification> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.STRING })
  notificationID?: string;

  @ForeignKey(() => User)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  userID: number;

  @ForeignKey(() => Event)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  eventID: number;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(NotificationType)) })
  notificationType: NotificationType;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  timestamp: Date;

  @Field(() => String)
  @Column({ type: DataType.TEXT })
  message: string;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(NotificationReadStatus)) })
  readStatus: NotificationReadStatus;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Event)
  event: Event;
}
