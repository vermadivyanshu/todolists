import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { AuthLoginGuard } from './auth-login.guard';

export const routes: Routes = [
{
  path: 'login',
  component: LoginComponent,
  canActivate: [AuthLoginGuard]
},
{
  path: 'home',
  component: HomeComponent
},
{
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
},
{
  path: '**',
  redirectTo: 'home'
}];
