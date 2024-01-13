import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { authConfig } from 'src/globals';
import { UserInput } from 'src/user/user.input.model';
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
  async login(@Request() req, @Response() res: Res): Promise<void> {
    const userInput = req.body;
    const userSession = this.sessionService.getSessionFromRequest(req);

    if (this.sessionService.getSession(userSession)) {
      res.status(200).json({ message: 'Session already exists' });
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
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  @Post('/register')
  @UseGuards(AuthGuard)
  public async register(@Body() userInput: UserInput): Promise<void> {
    this.authService.createUser(userInput);
    return;
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
