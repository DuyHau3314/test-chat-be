import { BelongsToMany, Column, DataType, Default, ForeignKey, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { RoomParticipants } from './roomParticipants.schema';
import { Auth } from '@auth/models/auth.schema';
import { Message } from './message.schema';

@Table({
  tableName: 'Room',
})
export class Room extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column
  name!: string;

  @Default(true)
  @Column
  isDirect!: boolean;

  @Default(DataType.NOW)
  @Column
  createdAt?: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt?: Date;

  @Default('')
  @Column
  lastMessage!: string;

  @BelongsToMany(() => Auth, () => RoomParticipants)
  participants!: Auth[];
}
