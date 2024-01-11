import { Module } from '@nestjs/common';
import { FilesystemObjectService } from './filesystem-object.service';
import { FilesystemObjectController } from './filesystem-object.controller';

@Module({
  providers: [FilesystemObjectService],
  controllers: [FilesystemObjectController],
})
export class FilesystemObjectModule {}
