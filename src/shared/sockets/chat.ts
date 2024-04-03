import { IJoinRoom, IRoomMessageInfo } from '@chat/interfaces/chat.interface';
import { chatService } from '@service/db/chat.service';
import { Server, Socket } from 'socket.io';

export let socketIOChatObject: Server;

export class SocketIOChatHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('join room', (info: IJoinRoom) => {
        const { roomId, userId } = info;

        socket.join(roomId);
        socket.to(roomId).emit('user joined', userId);
      });

      // Listen for new messages
      socket.on('new message', async (info: IRoomMessageInfo) => {
        const { roomId, message, senderId } = info;

        // Save message
        await chatService.addMessageToRoom({
          message: message.message,
          senderId: senderId,
          roomId: roomId,
        });

        socket.to(roomId).emit('new message saved', message);
      });
    });
  }
}
