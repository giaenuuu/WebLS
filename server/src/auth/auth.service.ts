import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as crypto from 'crypto';
import { UserInput } from 'src/user/user-input.dto';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async createUser(userInput: UserInput, res) {
    const userExists = await this.userModel.findOne({
      where: { username: userInput.username },
    });

    if (userExists) {
      res.status(409).json({
        message: `User with username '${userInput.username}' already exists`,
        error: 'Conflict',
        statusCode: '409',
      });
      return;
    }

    var nameRegex = /^[a-zA-Z]+$/;
    if (userInput.username.length < 4 || !nameRegex.test(userInput.username)) {
      res.status(400).json({
        message: 'Invalid username',
        error: 'Bad Request',
        statusCode: '400',
      });
      return;
    }

    var passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-])[A-Za-z\d!@#$%^&*()_+-]+$/;
    if (
      userInput.password.length < 8 ||
      !passwordRegex.test(userInput.password)
    ) {
      res.status(400).json({
        message: 'Invalid password',
        error: 'Bad Request',
        statusCode: '400',
      });
      return;
    }

    const salt = this.generateSalt();
    const hash = this.hashPassword(userInput.password, salt);

    try {
      await this.userModel.create({
        username: userInput.username,
        password_salt: salt,
        password_hash: hash,
      });
      res.status(200).json({});
    } catch (errors) {
      res.status(500).json({
        message: `A unknown error occured while creating the user with username '${userInput.username}'`,
        error: 'Internal Server Error',
        statusCode: '500',
      });
      return;
    }
  }

  public async authenticateUser(userInput: UserInput): Promise<User> {
    const unauthorizedException = new HttpException(
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
    );

    if (!userInput || !userInput.username || !userInput.password) {
      throw unauthorizedException;
    }

    const user = await this.userModel.findOne({
      where: { username: userInput.username },
    });

    if (!user) {
      throw unauthorizedException;
    }

    const passwordMatch = this.verifyPassword(
      userInput.password,
      user.password_hash,
      user.password_salt,
    );

    if (!passwordMatch) {
      throw unauthorizedException;
    }

    return user;
  }

  // Chat GPT function. Is used so we don't need more packages
  private generateSalt() {
    // generating a random byte array with length 16
    const randomBytes = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 256),
    );
    // converting the previous generated array to a string with random chars
    return Buffer.from(randomBytes).toString('hex');
  }

  private hashPassword(password, salt) {
    const combined = password + salt;
    const hashedPassword = this.generateHash(combined);
    return hashedPassword;
  }

  private verifyPassword(userInputPassword, storedHashedPassword, storedSalt) {
    const hashedUserInputPassword = this.hashPassword(
      userInputPassword,
      storedSalt,
    );
    return hashedUserInputPassword === storedHashedPassword;
  }

  private generateHash(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
