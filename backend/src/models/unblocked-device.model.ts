import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "unblocked_devices", timestamps: false })
export class UnblockedDevice extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.ENUM("IP", "UUID"), allowNull: false })
  declare targetType: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare targetValue: string;

  @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
  declare createdAt: Date;
}
