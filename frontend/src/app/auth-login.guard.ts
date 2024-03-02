import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from './services/localstorage.service';


export const authLoginGuard: CanActivateFn = (route, state) => {
  if( inject(LocalstorageService).getItem('todo-token')) {
    inject(Router).navigate(['home']);
  }
  return true;
};
