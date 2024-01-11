import { IsString, IsBoolean, IsEnum } from 'class-validator';

export enum Sorting {
  NAME,
  MODIFICATION_TIME,
  LAST_ACCESS_TIME,
  SIZE,
  FILE_EXTENSION,
}

export class FilesystemObjectInput {
  @IsString()
  path: string;

  @IsBoolean()
  showHidden: boolean;

  @IsBoolean()
  reverse: boolean;

  @IsEnum(Sorting)
  sortBy: Sorting;
}
