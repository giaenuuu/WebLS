import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SessionService } from '../global/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    return this.validate(request);
  }

  validate(req: any): boolean {
    const requestSession = this.sessionService.getSessionFromRequest(req);
    const serverSession = this.sessionService.getSession(requestSession);

    if (serverSession) {
      return true;
    }

    return false;
  }
}
