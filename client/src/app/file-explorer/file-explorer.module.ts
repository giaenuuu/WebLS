import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileExplorerRoutingModule } from './file-explorer-routing.module';
import { FileExplorerComponent } from './file-explorer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FileExplorerComponent
  ],
  imports: [CommonModule, FileExplorerRoutingModule, ReactiveFormsModule],
})
export class FileExplorerModule {}
