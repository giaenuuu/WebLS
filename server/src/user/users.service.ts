import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User)private userModel: typeof User) {}
    
      public async findAll(): Promise<User[]> {
        return this.userModel.findAll();
      }
    
      public findById(id: string): Promise<User> {
        return this.userModel.findOne({
          where: {
            id,
          },
        });
      }
    
      public async deleteById(id: string): Promise<void> {
        const user = await this.findById(id);
        await user.destroy();
      }
}
