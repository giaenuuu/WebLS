import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesystemObjectModule } from './filesystem-object/filesystem-object.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'webls_app',
      password: 'sml12345!',
      database: 'webls',
      models: [User],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    FilesystemObjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
