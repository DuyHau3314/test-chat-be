import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
  message: Joi.string().optional().allow(null, ''),
  senderId: Joi.string().required(),
  roomId: Joi.string().optional().allow(null, ''),
});

const createChatRoomSchema: ObjectSchema = Joi.object().keys({
  senderId: Joi.string().required(),
  receiverIds: Joi.array().items(Joi.string()).required(),
  roomName: Joi.string().optional().allow(null, ''),
});

const addParticipantSchema: ObjectSchema = Joi.object().keys({
  roomId: Joi.string().required(),
  userId: Joi.string().required(),
});

export { addChatSchema, createChatRoomSchema, addParticipantSchema };
