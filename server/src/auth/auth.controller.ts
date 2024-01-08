import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInput } from 'src/user/user.input.model';
import * as uuid from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req, @Response() res): Promise<void> {
    const userInput = req.body;
    const user = await this.authService.authenticateUser(userInput);
    if (user) {
      // Generate a unique session token
      const sessionToken = uuid.v4();

      // Set session data, including the token
      req.session.user = { ...user, sessionToken };

      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  @Post('/register')
  public async register(@Body() userInput: UserInput): Promise<void> {
    this.authService.createUser(userInput);
    return;
  }
}
