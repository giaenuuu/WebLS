export enum Sorting {
  NAME,
  MODIFICATION_TIME,
  LAST_ACCESS_TIME,
  SIZE,
  FILE_EXTENSION,
}

export interface FilesystemObjectInput {
  path: string;
  showHidden: boolean;
  reverse: boolean;
  sortBy: Sorting;
}
