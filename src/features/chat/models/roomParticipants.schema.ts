import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Room } from './room.scheme';
import { Auth } from '@auth/models/auth.schema';

@Table({
  tableName: 'RoomParticipants'
})
export class RoomParticipants extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Room)
  @Column
  roomId!: string;

  @ForeignKey(() => Auth)
  @Column
  userId!: string;
  @Column
  joinedAt!: Date;

  @Column
  lastReadMessageId!: string;

  @Column
  isTyping!: boolean;

  @Column
  createdAt?: Date;

  @Column
  leftAt?: Date;

  @BelongsTo(() => Room)
  room!: Room;

  @BelongsTo(() => Auth)
  user!: Auth;
}
