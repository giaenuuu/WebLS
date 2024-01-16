import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './core/guards/auth.guard';
import { FileExplorerModule } from './file-explorer/file-explorer.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => AuthModule,
  },
  {
    path: 'file-explorer',
    loadChildren: () => FileExplorerModule,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'file-explorer',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
