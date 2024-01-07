import { Body, Controller, Get, Post, Headers, HttpStatus, HttpException, Header } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInput } from 'src/user/user.input.model';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Get('login')
    test(@Headers('authorization') authHeader: string) {
       this.authService.authenticateUser(authHeader);
    }

    @Post('/register')
    register(@Body() userInput: UserInput): Promise<void> {
        this.authService.createUser(userInput);
        return;
    }
}
