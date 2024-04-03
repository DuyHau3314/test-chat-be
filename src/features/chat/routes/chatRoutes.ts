import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@chat/controllers/add-chat-message';
import { Get as GetListChat } from '@chat/controllers/get-chat';
import { Get as GetMessages } from '@chat/controllers/get-messages';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/chat/message/list', authMiddleware.checkAuthentication, GetMessages.prototype.messagesInRoom);
    this.router.post('/chat/message', authMiddleware.checkAuthentication, Add.prototype.message);
    this.router.post('/chat/add-room', authMiddleware.checkAuthentication, Add.prototype.room);
    this.router.post('/chat/add-room-participant', authMiddleware.checkAuthentication, Add.prototype.participate);
    this.router.get('/chat/message/conversation-list', authMiddleware.checkAuthentication, GetListChat.prototype.rooms);
    this.router.get('/user/profile/search/:name', authMiddleware.checkAuthentication, GetListChat.prototype.searchUser);

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
