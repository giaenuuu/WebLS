import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileExplorerComponent } from './file-explorer.component';

const routes: Routes = [
  { path: '' , component: FileExplorerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileExplorerRoutingModule {}
