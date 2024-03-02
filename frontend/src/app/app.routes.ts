import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: LoginComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'home',
  component: HomeComponent,
  children: [{
    path: 'list/:listId',
    component: ListComponent
  }]
},
{
  path: '**',
  redirectTo: 'home'
}];
