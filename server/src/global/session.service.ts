// session.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { authConfig } from 'src/globals';
import * as uuid from 'uuid';
import { SessionInformation } from '../auth/session-information.interface';

@Injectable()
export class SessionService {
  private sessions: Record<string, SessionInformation> = {};

  createSession(userId: number): string {
    const sessionId = uuid.v4();

    this.sessions[sessionId] = {
      userId: userId,
      createdAt: Date.now(),
    };
    return sessionId;
  }

  getSession(sessionId: string): any {
    const session = this.sessions[sessionId];

    if (
      session &&
      Date.now() >= session.createdAt + authConfig.sessionExpiresAfterMS
    ) {
      this.removeSession(sessionId);
      return undefined;
    }
    return session;
  }

  removeSession(sessionId: string): void {
    delete this.sessions[sessionId];
  }

  getSessionFromRequest(req: Request): string | undefined {
    const cookies = req.headers.cookie;

    if (!cookies) {
      return undefined;
    }

    const cookieArray = cookies.split(';');
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');

      if (name === authConfig.sessionCookieName) {
        return value;
      }
    }

    return undefined;
  }
}
