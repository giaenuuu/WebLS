import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesystemObjectModule } from './filesystem-object/filesystem-object.module';
import { CustomLogger } from './logger/logger.service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as any,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    FilesystemObjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLogger],
})
export class AppModule {}
