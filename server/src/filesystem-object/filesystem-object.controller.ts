import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { FilesystemObjectService } from './filesystem-object.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesystemObjectInput } from './filesystem-object-input.dto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

@Controller('filesystem')
export class FilesystemObjectController {
  constructor(private filesystemObjectService: FilesystemObjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  async getFileSystemObjects(
    @Body() body: FilesystemObjectInput,
    @Response() res,
  ): Promise<void> {
    if (await this.filesystemObjectService.isRequestBodyValid(body, res)) {
      try {
        const filesystemObjects =
          await this.filesystemObjectService.getFileSystemObjects(body);

        res.status(200).json(filesystemObjects);
      } catch (err) {
        res.status(500).json({
          message: 'A unknown error occured while performing the request',
          error: 'Internal Server Error',
          statusCode: '500',
        });
        throw new Error(err);
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getBasePath(@Response() res): Promise<void> {
    const basePath = process.env.LOCAL_PATH_HOME_DIR;

    //throw new Error(error); //Test error log ^^
    return res.status(200).json({
      basePath,
      message: 'Request successful',
      statusCode: '200',
    });
  }
}
