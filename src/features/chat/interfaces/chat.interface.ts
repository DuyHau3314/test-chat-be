import { Model } from 'sequelize-typescript';

export interface IMessageData {
  message: string;
  senderId: string;
  roomId: string;
}

export interface RoomModel extends Model {
  id: string;
  name: string;
  isDirect: boolean;
  createdAt?: Date;
}

export interface IJoinRoom {
  roomId: string;
  userId: string;
}

export interface IRoomMessageInfo {
  roomId: string;
  message: IMessageData;
  senderId: string;
}
