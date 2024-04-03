import { chatService } from '@service/db/chat.service';
import { Request, Response } from 'express';

export class Get {
  public async rooms(req: Request, res: Response): Promise<void> {
    const userId = req.currentUser!.id;
    const rooms = await chatService.getRooms(userId);

    res.status(200).json({
      data: rooms
    });
  }

  public async searchUser(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const users = await chatService.searchUserAndRoom(name as string);

    res.status(200).json({
      data: users
    });
  }
}
