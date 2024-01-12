import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as uuid from 'uuid';
import { AuthGuard } from './auth.guard';
import { validateOrReject } from 'class-validator';
import { UserInput } from 'src/user/user-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Request() req,
    @Body() body: UserInput,
    @Response() res,
  ): Promise<void> {
    try {
      var userInput: UserInput = body;
      await validateOrReject(body);
    } catch (errors) {
      res.status(400).json({
        message: 'Bad Request: Invalid request body',
      });
      return;
    }

    if (req.session && req.session.user) {
      // Return the existing session without creating a new one
      res.status(200).json({ message: 'Session already exists' });
      return;
    }

    const user = await this.authService.authenticateUser(userInput);
    if (user) {
      // Generate a unique session token
      const sessionToken = uuid.v4();

      // Set session data, including the token
      req.session.user = { ...user, sessionToken };

      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({
        message: 'Invalid credentials',
      });
    }
  }

  @Post('/register')
  public async register(@Body() userInput: UserInput): Promise<void> {
    try {
      await validateOrReject(userInput);
    } catch (errors) {
      return;
    }

    this.authService.createUser(userInput);
    return;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req, @Response() res): Promise<void> {
    req.session = null;
    // Clear session cookie on the client
    res.clearCookie('webls_session');

    res.status(200).json({ message: 'Logout successful' });
  }
}
