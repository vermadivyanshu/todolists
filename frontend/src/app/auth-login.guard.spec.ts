import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthLoginGuard } from './auth-login.guard';
import { LocalstorageService } from './services/localstorage.service';

describe('AuthLoginGuard', () => {
  let guard: AuthLoginGuard;
  let router: Router;
  let localStorageService: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthLoginGuard, LocalstorageService]
    });
    guard = TestBed.inject(AuthLoginGuard);
    router = TestBed.inject(Router);
    localStorageService = TestBed.inject(LocalstorageService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to home if token exists', () => {
    spyOn(localStorageService, 'getItem').and.returnValue('some-token');
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    const result = guard.canActivate();

    expect(navigateSpy).toHaveBeenCalledWith(['home']);
    expect(result).toBeFalse(); // because navigation occurs, guard should return false
  });

  it('should return true if token does not exist', () => {
    spyOn(localStorageService, 'getItem').and.returnValue(null);
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    const result = guard.canActivate();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });
});