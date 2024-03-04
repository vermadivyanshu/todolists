import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
    service = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to login', () => {
    const dummyToken = { access_token: 'dummyToken' };
    const dummyUsername = 'testuser';
    const dummyPassword = 'testpassword';

    service.login(dummyUsername, dummyPassword).subscribe(token => {
      expect(token).toEqual(dummyToken);
    });

    const req = httpTestingController.expectOne('/api/auth/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ username: dummyUsername, password: dummyPassword });
    
    req.flush(dummyToken);
  });

  it('should store token in localStorage on successful login', () => {
    const dummyToken = { access_token: 'dummyToken' };
    const dummyUsername = 'testuser';
    const dummyPassword = 'testpassword';

    service.login(dummyUsername, dummyPassword).subscribe();

    const req = httpTestingController.expectOne('/api/auth/login');
    req.flush(dummyToken);

    expect(localStorage.getItem('todo-token')).toEqual(dummyToken.access_token);
  });
});