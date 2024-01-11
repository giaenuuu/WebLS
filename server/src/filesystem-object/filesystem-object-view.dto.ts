export interface FilesystemObjectView {
  objects: FilesystemObject[];
}

export enum FilesystemObjectType {
  FILE,
  DIRECTORY,
  EXECUTABLE,
}

export interface FilesystemObject {
  type: FilesystemObjectType;
  name: string;
  size: number;
  lastModifiedOn: Date;
}
