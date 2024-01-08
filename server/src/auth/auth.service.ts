import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInput } from 'src/user/user.input.model';
import { User } from 'src/user/user.model';
import { authConfig } from 'src/globals';
import { InjectModel } from '@nestjs/sequelize';
import * as base64 from 'base-64';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async createUser(userInput: UserInput) {
    const userExists = await this.userModel.findOne({
      where: { username: userInput.username },
    });

    if (userExists) {
      throw new HttpException(
        `cannot create user with username: ${userInput.username}`,
        HttpStatus.CONFLICT,
      );
    }

    const salt = this.generateSalt();
    const hash = this.hashPassword(userInput.password, salt);

    this.userModel.create({
      username: userInput.username,
      password_salt: salt,
      password_hash: hash,
    });
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

  private extractCredentialsFromAuthHeader(authHeader: string): Credentials {
    // Extract the base64-encoded credentials part from the Authorization header
    const encodedCredentials = authHeader.split(' ')[1];
    // Decode the base64-encoded credentials
    const decodedCredentials = base64.decode(encodedCredentials);
    // Extract username and password
    const [username, password] = decodedCredentials.split(':');

    return { username, password };
  }

  private generateHash(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
