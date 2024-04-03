import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import Logger from 'bunyan';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';
import { Auth } from '@auth/models/auth.schema';
import { Message } from '@chat/models/message.schema';
import { Room } from '@chat/models/room.scheme';
import { RoomParticipants } from '@chat/models/roomParticipants.schema';

const log: Logger = config.createLogger('setupDatabase');

export const sequelize = new Sequelize(config.DATABASE_URL!, {
  dialect: 'postgres',
  models: [Auth, Message, Room, RoomParticipants],
  logging: (msg) => log.info(msg),
});
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    log.info('Successfully connected to the database.');
    await redisConnection.connect();
  } catch (error) {
    log.error('Error connecting to the database:', error);
    process.exit(1);
  }

  sequelize.addHook('afterDisconnect', () => {
    log.info('Database connection disconnected. Attempting to reconnect...');
    connectDatabase();
  });
};
