import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/services/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let moduleRef: TestingModule;
  let service: AuthService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [{
        provide: AuthService,
        useValue: {
          signIn: jest.fn()
        }
      }],
      controllers: [AuthController],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    service = moduleRef.get<AuthService>(AuthService);
  });

  afterAll(() => moduleRef.close());

  it('should call authService.signIn', async () => {
    await controller.signIn({username: 'user', password: 'pass'});
    expect(service.signIn).toHaveBeenCalledTimes(1);
    expect(service.signIn).toHaveBeenCalledWith('user', 'pass');
  })

  it('should throw an error when signin fails', async () => {
    jest.spyOn(service, 'signIn').mockImplementation(async () => {
      throw new Error('failed');
    });
    await expect(controller.signIn({username: 'user', password: 'pass'})).rejects.toThrow(Error);
    expect(service.signIn).toHaveBeenCalledTimes(1);
    expect(service.signIn).toHaveBeenCalledWith('user', 'pass');
  });
});
