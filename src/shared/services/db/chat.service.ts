import { Auth } from '@auth/models/auth.schema';
import { IMessageData, RoomModel } from '@chat/interfaces/chat.interface';
import { Message } from '@chat/models/message.schema';
import { Room } from '@chat/models/room.scheme';
import { RoomParticipants } from '@chat/models/roomParticipants.schema';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { Op } from 'sequelize';

class ChatService {
  public async getMessagesRoomById(roomId: string, offset = 0, limit = 20): Promise<{
    room: Room,
    messages: Message[],
    hasMore: boolean
  }> {
    const room = await Room.findByPk(roomId);

    if(!room){
      throw new NotAuthorizedError('Room not found');
    }

    const messages = await Message.findAll({
      where: { roomId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
          model: Auth,
          as: 'sender',
          attributes: ['id', 'username', 'email', 'avatarColor'],
      }],
  });

  const hasMore = offset === 0 ? messages.length === limit : true;


  return {
    room,
    messages: messages.reverse(),
    hasMore
  };
  }

  public async createRoom(senderId: string, receiverIds: string[], roomName = ''): Promise<RoomModel> {
    const listAuthIds = [senderId, ...receiverIds];

    const participants = await Auth.findAll({
      where: {
        id: listAuthIds
      }
    });

    if(participants.length !== listAuthIds.length){
      throw new NotAuthorizedError('Participant not found');
    };


    const room = await Room.create({
      name: roomName || receiverIds.join(', '),
      isDirect: receiverIds.length < 2
    });

    await this.addReceiverToRoom(room, [senderId, ...receiverIds]);
    return room;
  }

  public async addMessageToRoom(data: IMessageData): Promise<{
    message: Message,
    room: Room
  }> {
    const room = await Room.findByPk(data.roomId);

    if(!room){
      throw new NotAuthorizedError('Room not found');
    }

    const message = await Message.create({
      message: data.message,
      senderId: data.senderId,
      roomId: room.id,
    });

    // Update last message and updatedAt
    room.lastMessage = data.message;
    room.updatedAt = new Date();

    await room.save();

    // Emit event socket

    return {
      message,
      room
    };
  }

  private async addReceiverToRoom(room: Room, receiverIds: string[]): Promise<void> {
    await room.$add('participants', receiverIds);
  }

  public async addParticipantToRoom(roomId: string, userId: string): Promise<void> {
    const room = await Room.findByPk(roomId);

    if(!room){
      throw new NotAuthorizedError('Room not found');
    }

    await room.$add('participants', userId);

    await room.update({ updatedAt: new Date() });
  }

  public async getRooms(userId: string): Promise<Room[]> {
    const participantEntries = await RoomParticipants.findAll({
      where: { userId },
      include: [{
        model: Room,
        order: ['updatedAt', 'DESC']
      }]
    });

    const rooms = participantEntries.map(entry => entry.room);

    const uniqueRooms = rooms.filter((value, index, self) =>
    index === self.findIndex((t) => t.id === value.id)
  ).sort((a: any, b: any) => b.updatedAt - a.updatedAt); // This assumes updatedAt is a Date object

  return uniqueRooms;
  }

  public async searchUserAndRoom(userOrRoomName: string): Promise<any> {
    const users = await Auth.findAll({
      where: {
        username: {
          [Op.iLike]: `%${userOrRoomName}%`
        }
      }
    });

    const rooms = await Room.findAll({
      where: {
        name: {
          [Op.iLike]: `%${userOrRoomName}%`
        }
      }
    });

    return {
      users,
      rooms
    };
  }
}

export const chatService = new ChatService();
