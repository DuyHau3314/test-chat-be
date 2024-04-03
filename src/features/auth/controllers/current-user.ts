import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IAuthModel } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';

export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;
    const existingUser = await authService.getAuthUserById(`${req.currentUser!.id}`) as IAuthModel;
    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}
