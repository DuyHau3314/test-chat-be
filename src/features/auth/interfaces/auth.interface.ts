import { Model } from 'sequelize-typescript';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

export interface AuthPayload {
  id: string;
  username: string;
  email: string;
  password: string;
  avatarColor: string;
}

export interface IAuthModel extends Model {
  id: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
  comparePassword(password: string): Promise<boolean>;
}

export interface ISignUpData {
  id?: string;
  username: string;
  email: string;
  password: string;
  avatarColor: string;
  profilePicture: string;
}

export interface IEmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}
