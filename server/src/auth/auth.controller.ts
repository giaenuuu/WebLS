import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { authConfig } from 'src/globals';
import { UserInput } from 'src/user/user-input.dto';
import { SessionService } from '../global/session.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

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
        message: 'Invalid request body',
        error: 'Bad Request',
        statusCode: '400',
      });
      return;
    }

    const requestSession = this.sessionService.getSessionFromRequest(req);

    if (requestSession && this.sessionService.getSession(requestSession)) {
      // Return the existing session without creating a new one
      res
        .status(200)
        .json({ message: 'Session already exists', statusCode: '200' });
      return;
    }

    const user = await this.authService.authenticateUser(userInput);
    if (user) {
      const sessionId = this.sessionService.createSession(user.id);
      res.cookie(authConfig.sessionCookieName, sessionId, {
        maxAge: authConfig.sessionExpiresAfterMS,
        httpOnly: true,
      });

      res.status(200).json({
        message: 'Login successful',
        user: { userId: user.id, username: user.username },
      });
    } else {
      res.status(401).json({
        message: 'Invalid credentials',
        error: 'Unauthorized',
        statusCode: '401',
      });
    }
  }

  @Post('/register')
  @UseGuards(AuthGuard)
  public async register(
    @Body() userInput: UserInput,
    @Response() res,
  ): Promise<void> {
    try {
      await validateOrReject(userInput);
    } catch (errors) {
      res.status(400).json({
        message: 'Invalid request body',
        error: 'Bad Request',
        statusCode: '400',
      });
      return;
    }

    this.authService.createUser(userInput, res);
    return;
  }

  @Get('verify')
  async verify(@Request() req, @Response() res) {
    const requestSession = this.sessionService.getSessionFromRequest(req);

    if (requestSession && this.sessionService.getSession(requestSession)) {
      // Return the existing session without creating a new one
      res.status(200).json({ message: 'Session already exists' });
      return;
    } else {
      res.status(401).json({ message: 'No session found.' });
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req: any, @Response() res): Promise<void> {
    const session = this.sessionService.getSessionFromRequest(req);
    this.sessionService.removeSession(session);
    res.clearCookie(authConfig.sessionCookieName);
    res.status(200).json({ message: 'Logout successful' });
  }
}
