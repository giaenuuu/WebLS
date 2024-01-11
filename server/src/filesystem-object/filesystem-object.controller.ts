import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { FilesystemObjectService } from './filesystem-object.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesystemObjectInput } from './filesystem-object-input.dto';

@Controller('filesystem')
export class FilesystemObjectController {
  constructor(private filesystemObjectService: FilesystemObjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  async login(
    @Body() body: FilesystemObjectInput,
    @Response() res,
  ): Promise<void> {
    if (await this.filesystemObjectService.isRequestBodyValid(body)) {
      try {
        const filesystemObjects =
          await this.filesystemObjectService.getFileSystemObjects(body);

        res
          .status(200)
          .json({ message: 'Request successful', filesystemObjects });
      } catch (err) {
        res.status(500).json({
          message:
            'Internal Server Error: Error occured while performing the request',
        });
      }
    } else {
      res.status(400).json({
        message: 'Bad Request: Invalid request body',
      });
    }
  }
}
