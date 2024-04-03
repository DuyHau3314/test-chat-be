import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

export class SignOut {
  public async update(req: Request, res: Response): Promise<void> {
    req.session = {
      jwt: ''
    };
    console.log('====req.session', req.session);
    res.status(HTTP_STATUS.OK).json({ message: 'Logout successful', user: {}, token: '' });
  }
}
