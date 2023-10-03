import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "RolePermission",
})
export class RolePermission extends Model<RolePermission> {
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @Column({ type: DataType.STRING })
  permission: string;
}
