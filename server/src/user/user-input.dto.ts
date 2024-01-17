import { IsString } from 'class-validator';

export class UserInput {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
