import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/typeorm.config.test';
import { User } from 'src/user/user.entity';
import { List } from 'src/list/list.entity';
import { Todo } from 'src/todo/todo.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let moduleRef: TestingModule;
  let repository: Repository<User>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([User, List, Todo]),
        JwtModule.register({
          secret: 'test',
        }),
      ],
      providers: [AuthService, UserService],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    const todoRepository = moduleRef.get<Repository<Todo>>(
      getRepositoryToken(Todo),
    );
    const listRepository = moduleRef.get<Repository<List>>(
      getRepositoryToken(List),
    );
    await todoRepository.query('TRUNCATE TABLE public.todo CASCADE');
    await listRepository.query('TRUNCATE TABLE public.list CASCADE');
    await repository.query('TRUNCATE TABLE public.user CASCADE');
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('signIn', () => {
    it('should return access token when the user name and password matches', async () => {
      await repository.save({
        username: 'user-test-1',
        password: 'pass',
      });
      const expectedResponse = await service.signIn('user-test-1', 'pass');
      expect(expectedResponse.access_token).toBeTruthy();
    });

    it('should throw an error when user does not exist', async () => {
      await expect(service.signIn('invalid', 'invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error when the user password does not match', async () => {
      await expect(service.signIn('user-test-1', 'invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
