import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/user/user.model';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
