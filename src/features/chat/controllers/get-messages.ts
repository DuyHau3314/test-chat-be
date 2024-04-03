import { chatService } from '@service/db/chat.service';
import { Request, Response } from 'express';

export class Get {
  public async messagesInRoom(req: Request, res: Response): Promise<void> {
    const {roomId} = req.params;
    const messages = await chatService.getMessagesRoomById(roomId);

    res.status(200).json({
      data: messages
    });
  }
}
