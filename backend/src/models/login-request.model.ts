import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "login_requests", timestamps: false })
export class LoginRequest extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ field: "device_uuid", type: DataType.STRING, allowNull: false })
  declare deviceUuid: string;

  @Column({ field: "ip_address", type: DataType.STRING, allowNull: true })
  declare ipAddress: string;

  @Column({ field: "test_id", type: DataType.STRING, allowNull: true })
  declare testId: string;

  @Column({ type: DataType.ENUM("FIRST_TIME", "SECONDARY"), allowNull: false })
  declare type: string;

  @Column({ type: DataType.ENUM("PENDING", "ALLOWED", "REJECTED"), defaultValue: "PENDING" })
  declare status: string;

  @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
  declare createdAt: Date;
}
