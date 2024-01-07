import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class UserInput extends Model {
  @Column
  username: string;

  @Column
  password: string;
}
