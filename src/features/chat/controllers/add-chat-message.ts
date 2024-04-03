import { IMessageData } from '@chat/interfaces/chat.interface';
import { addChatSchema, addParticipantSchema, createChatRoomSchema } from '@chat/schemes/chat';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { chatService } from '@service/db/chat.service';
import { Request, Response } from 'express';

export class Add {
  @joiValidation(addChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const data: IMessageData = req.body;
    const message = await chatService.addMessageToRoom(data);

    res.status(201).json({
      message: 'Message added successfully',
      data: message
    });
  }

  @joiValidation(createChatRoomSchema)
  public async room(req: Request, res: Response): Promise<void> {
    const { senderId, receiverIds, roomName } = req.body;
    const room = await chatService.createRoom(senderId, receiverIds, roomName);

    res.status(201).json({
      message: 'Room created successfully',
      data: room
    });
  }

  @joiValidation(addParticipantSchema)
  public async participate(req: Request, res: Response): Promise<void> {
    const { roomId, userId } = req.body;
    await chatService.addParticipantToRoom(roomId, userId);

    res.status(200).json({
      message: 'Participant added successfully'
    });
  }
}
