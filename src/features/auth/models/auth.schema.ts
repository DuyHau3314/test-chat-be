// src/features/auth/models/auth.model.ts
import { Table, Column, Model, CreatedAt, Default, PrimaryKey, DataType, BeforeSave, Index, HasMany, BelongsToMany } from 'sequelize-typescript';
import { hash, compare } from 'bcryptjs';
import { Message } from '@chat/models/message.schema';
import { Room } from '@chat/models/room.scheme';
import { RoomParticipants } from '@chat/models/roomParticipants.schema';

const SALT_ROUND = 10;

@Table({
  tableName: 'Auth'
})
export class Auth extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index({
    unique: true
  })
  @Column
  username!: string;

  @Column
  email!: string;

  @Column
  password!: string;

  @Column
  avatarColor!: string;

  @Column
  profilePicture!: string;

  @CreatedAt
  createdAt!: Date;

  @Default('')
  @Column
  passwordResetToken!: string;

  @Column(DataType.BIGINT)
  passwordResetExpires!: number;

  // Relationship
  @HasMany(() => Message)
  messages!: Message[];

  @BelongsToMany(() => Room, () => RoomParticipants)
  rooms!: Room[];

  // Hooks
  @BeforeSave
  static async hashPassword(instance: Auth): Promise<void> {
    if (instance.password) {
      instance.password = await hash(instance.password, SALT_ROUND);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
