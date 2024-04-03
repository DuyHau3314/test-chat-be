import { Application } from 'express';
import { healthRoutes } from './healthRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { authRoutes } from '@auth/routes/authRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { chatRoutes } from '@chat/routes/chatRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    // app.use('/queues', serverAdapter.getRouter());
    app.use('', healthRoutes.health());
    app.use('', healthRoutes.env());
    app.use('', healthRoutes.instance());
    app.use('', healthRoutes.fiboRoutes());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
  };
  routes();
};
