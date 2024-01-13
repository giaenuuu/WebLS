import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { validateOrReject } from 'class-validator';
import { FilesystemObjectInput, Sorting } from './filesystem-object-input.dto';
import {
  FilesystemObject,
  FilesystemObjectType,
  FilesystemObjectView,
} from './filesystem-object-view.dto';
import * as quote from 'shell-quote';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

@Injectable()
export class FilesystemObjectService {
  public async isRequestBodyValid(
    filesystemObjectInput: FilesystemObjectInput,
    res
  ) : Promise<boolean> {
    try {
      await validateOrReject(filesystemObjectInput);
    } catch (errors) {
      res.status(400).json({
        message: 'Invalid request body',
        error: 'Bad Request',
        statusCode: '400'
      });
      return false;
    }

    const basePath = process.env.LOCAL_PATH_HOME_DIR;
    const blackList = ['./', '../', '..', ";", "//", "#", "\\", "'", `"`, "`" ];
    if (
      !filesystemObjectInput.path.startsWith(basePath) ||
      blackList.some((item) => filesystemObjectInput.path.includes(item))
    ) {
      res.status(400).json({
        message: 'Invalid path',
        error: 'Bad Request',
        statusCode: '400'
      });
      return false;
    }

    //escape path
    filesystemObjectInput.path = quote.quote([`${filesystemObjectInput.path}`]);
    try {
      fs.accessSync(filesystemObjectInput.path, fs.constants.F_OK);
    } catch (errors) {
      res.status(400).json({
        message: `Path doesn't exist`,
        error: 'Bad Request',
        statusCode: '400'
      });
      return false;
    }

    return true;
  }

  public async getFileSystemObjects(
    filesystemObjectInput: FilesystemObjectInput,
  ): Promise<FilesystemObjectView> {
    try {
      var command =
        `cd ${filesystemObjectInput.path};` +
        `ls -Fl${this.getSortingFlag(filesystemObjectInput.sortBy)}${
          filesystemObjectInput.showHidden ? 'a' : ''
        }${filesystemObjectInput.reverse ? 'r' : ''} --full-time`;

      const { stdout, stderr } = await this.execPromise(command);

      if (!stdout) {
        throw '';
      }

      return this.bashOutputToFilesystemObjectView(stdout);
    } catch (error) {
      throw '';
    }
  }

  private getSortingFlag(sorting: Sorting): string {
    switch (sorting) {
      case Sorting.MODIFICATION_TIME:
        return 't';
      case Sorting.LAST_ACCESS_TIME:
        return 'u';
      case Sorting.SIZE:
        return 'S';
      case Sorting.FILE_EXTENSION:
        return 'X';
      case Sorting.NAME:
        return '';
    }
  }

  private execPromise(
    command: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject({ stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  private bashOutputToFilesystemObjectView(
    output: string,
  ): FilesystemObjectView {
    const lines = output.trim().split('\n').slice(1);
    const filesystemObjects: FilesystemObject[] = [];
    const invalidEndings = ['=>', '=', '>', '@', '|', '..', '../', './'];

    lines.forEach((line) => {
      var [permissions, links, owner, group, size, date, time, utc, name] = line
        .trim()
        .split(/\s+/);

      if (invalidEndings.some((ending) => name.endsWith(ending))) {
        return;
      }

      var type: FilesystemObjectType;
      switch (true) {
        case name.endsWith('/'):
          name = name.slice(0, -1);
          type = FilesystemObjectType.DIRECTORY;
          break;

        case name.endsWith('*'):
          name = name.slice(0, -1);
          type = FilesystemObjectType.EXECUTABLE;
          break;

        default:
          type = FilesystemObjectType.FILE;
          break;
      }

      const sizeInBytes = parseInt(size);
      const lastModifiedOn = new Date(`${date} ${time} ${utc}`);

      const filesystemObject: FilesystemObject = {
        type: type,
        name: name,
        size: sizeInBytes,
        lastModifiedOn: lastModifiedOn,
      };

      filesystemObjects.push(filesystemObject);
    });

    var filesystemObjectView: FilesystemObjectView = {
      objects: filesystemObjects,
    };

    return filesystemObjectView;
  }
}
