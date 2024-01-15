import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { FilesystemModule } from './filesystem/filesystem.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
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
