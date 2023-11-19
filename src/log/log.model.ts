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
import { User } from "../user/user.model";

export enum LogLevel {
  CRITICAL = "CRITICAL",
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

@ObjectType()
@InputType("ILog")
@Table({
  timestamps: true,
  tableName: "Log",
  omitNull: true,
  paranoid: true,
})
export class Log extends Model<Log> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.STRING })
  logID?: string;

  @ForeignKey(() => User)
  @Field((type) => Number)
  @Column({ type: DataType.INTEGER })
  userID: number;

  @Field(() => String)
  @Column({
    type: DataType.ENUM("System Activity", "Error", "User Activity", "Other"),
  })
  logType: string;

  @Field(() => String)
  @Column({ type: DataType.ENUM(...Object.values(LogLevel)) })
  logLevel: LogLevel;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  timestamp: Date;

  @Field(() => String)
  @Column({ type: DataType.TEXT })
  logMessage: string;

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
}
