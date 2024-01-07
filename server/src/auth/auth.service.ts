import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInput } from 'src/user/user.input.model';
import { User } from 'src/user/user.model';
import { authConfig } from 'src/globals';
import { InjectModel } from '@nestjs/sequelize';
import * as base64 from 'base-64';

const bcrypt = require('bcrypt');

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

  public async authenticateUser(authHeader: string) {
    const unauthorizedException = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw unauthorizedException; 
    }

    const credentials = this.extractCredentialsFromAuthHeader(authHeader);

    const user = await this.userModel.findOne({
      where: { username: credentials.username },
    });

    if (!user) {
      throw unauthorizedException; 
    }

    const isValid = this.verifyPassword(
      credentials.password,
      user.password_hash,
      user.password_salt,
    );

    if(!isValid){
      throw unauthorizedException;
    }
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
    const hashedPassword = bcrypt.hashSync(combined, authConfig.saltRounds);
    return hashedPassword;
  }

  private verifyPassword(userInputPassword, storedHashedPassword, storedSalt) {
    const combined = userInputPassword + storedSalt;
    const hashedUserInputPassword = bcrypt.hashSync(combined, 10);
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
}
