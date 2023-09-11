import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "UserRole",
})
export class UserRole extends Model<UserRole> {
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER })
  roleId: number;
}
