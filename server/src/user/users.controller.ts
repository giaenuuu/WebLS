import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
