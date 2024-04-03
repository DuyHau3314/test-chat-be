import { Auth } from '@auth/models/auth.schema';
import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Room } from './room.scheme';

@Table({
  tableName: 'Message',
})
export class Message extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column
  message!: string;

  @ForeignKey(() => Auth)
  @Column(DataType.UUID)
  senderId!: string;

  @ForeignKey(() => Room)
  @Column(DataType.UUID)
  roomId!: string;

  @Default(DataType.NOW)
  @Column
  createdAt!: Date;
}
