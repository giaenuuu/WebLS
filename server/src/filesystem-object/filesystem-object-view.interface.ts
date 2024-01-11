export interface FilesystemObjectView {
  objects: FilesystemObject[];
}

export interface FilesystemObject {
  type: FilesystemObjectType;
  name: string;
  size: number;
  lastModifiedOn: Date;
}

export enum FilesystemObjectType {
  FILE,
  DIRECTORY,
  EXECUTABLE,
}
