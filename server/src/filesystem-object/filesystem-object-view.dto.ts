import { FilesystemObjectType } from './filesystem-object-type.enum';

export interface FilesystemObjectView {
  objects: FilesystemObject[];
}

export interface FilesystemObject {
  type: FilesystemObjectType;
  name: string;
  size: number;
  lastModifiedOn: Date;
}
