import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Module({
  imports: [SequelizeModule.forRoot({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'webls_app',
    password: 'sml12345!',
    database: 'webls',
    models: [User],
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
