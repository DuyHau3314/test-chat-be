import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';
import { signupSchema } from '@auth/schemes/signup';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { Request, Response } from 'express';
import { IAuthModel } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email, password, username, avatarColor, avatarImage } = req.body;
    const existingUser = await authService.getUserByUsernameOrEmail(username, email);

    if (existingUser) {
      throw new BadRequestError('Username or email already exists');
    }

    const userId = await authService.generateId();

    const result: UploadApiResponse = (await uploads(avatarImage, `${userId}`, true, true)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError('File upload: Error occurred. Try again.');
    }

    const profilePicture = result.secure_url;

    const user = await authService.createAuthUser({ id:userId, email, password, username, avatarColor, profilePicture });
    const token = SignUp.prototype.signToken(user, user.id);

    req.session = {
      jwt: token
    };

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', user, token});
  }

  private signToken(data: IAuthModel, authId: string): string {
    return JWT.sign(
      {
        id: authId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }
}
