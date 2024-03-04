import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalstorageService } from './services/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalstorageService
  ) {}

  canActivate(): boolean {
    if (this.localStorageService.getItem('todo-token')) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}