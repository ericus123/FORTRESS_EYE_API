import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import {
  Column,
  DataType,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

type status = "ON" | "OFF";
interface SystemSettings {
  systemState: status;
  scheduling: status;
  notifications: status;
  liveStreaming: {
    enabled: status;
    quality: string;
  };
}

@ObjectType()
@InputType("ISystemSetting")
@Table({
  timestamps: true,
  tableName: "SystemSettings",
  omitNull: true,
  paranoid: true,
})
export class SystemSetting extends Model<SystemSetting> {
  @Field((type) => ID)
  @Index
  @PrimaryKey
  @Column({ type: DataType.INTEGER, defaultValue: 1, autoIncrement: false })
  id: number;

  @Field(() => DataType.JSON)
  @Column({ type: DataType.JSON, defaultValue: {} })
  settingValue: SystemSettings;

  @Field(() => String)
  @Column({ type: DataType.STRING })
  description: string;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE })
  deletedAt: Date;
}
