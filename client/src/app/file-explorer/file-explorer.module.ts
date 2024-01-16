import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileExplorerRoutingModule } from './file-explorer-routing.module';
import { FileExplorerComponent } from './file-explorer.component';

@NgModule({
  declarations: [
    FileExplorerComponent
  ],
  imports: [CommonModule, FileExplorerRoutingModule],
})
export class FileExplorerModule {}
