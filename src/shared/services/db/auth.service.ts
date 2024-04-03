import { IAuthModel, ISignUpData } from '@auth/interfaces/auth.interface'; // Adjust the import path as needed
import { Auth } from '@auth/models/auth.schema';
import { Helpers } from '@global/helpers/helpers';
import Sequelize from 'sequelize';
import {v4 as uuidv4} from 'uuid';

class AuthService {
  public async createAuthUser(data: ISignUpData): Promise<IAuthModel> {
    const user = await Auth.create(data as any);
    return user;
  }

  public async updatePasswordToken(authId: string, token: string, tokenExpiration: number): Promise<void> {
    await Auth.update(
      {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration
      },
      {
        where: { id: authId }
      }
    );
  }

  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthModel | null> {
    const user = await Auth.findOne({
      where: {
        [Sequelize.Op.or]: [
          { username },
          { email: Helpers.lowerCase(email) }
        ]
      }
    });
    return user;
  }

  public async getAuthUserByUsername(username: string): Promise<IAuthModel | null> {
    console.log('==username', username);
    const user = await Auth.findOne({
      where: { username }
    });
    return user;
  }

  public async getAuthUserByEmail(email: string): Promise<IAuthModel | null> {
    const user = await Auth.findOne({
      where: { email: Helpers.lowerCase(email) }
    });
    return user;
  }

  public async getAuthUserByPasswordToken(token: string): Promise<IAuthModel | null> {
    const user = await Auth.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          [Sequelize.Op.gt]: Date.now()
        }
      }
    });
    return user;
  }

  public getAuthUserById(id: string): Promise<IAuthModel | null> {
    return Auth.findByPk(id);
  }

  public generateId(): string {
    return uuidv4();
  }
}

export const authService: AuthService = new AuthService();
