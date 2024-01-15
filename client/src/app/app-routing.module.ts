import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { FilesystemModule } from './filesystem/filesystem.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => AuthModule,
  },
  {
    path: 'filesystem',
    loadChildren: () => FilesystemModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
