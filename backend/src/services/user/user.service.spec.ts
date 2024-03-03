import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/typeorm.config.test';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { List } from 'src/list/list.entity';
import { Todo } from 'src/todo/todo.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host:'localhost',
        port: 5432,
        username: 'postgres',
        password:'admin',
        database: 'todos_test',
        synchronize: true,
        logging: false,
        autoLoadEntities: true
      }), TypeOrmModule.forFeature([User, List, Todo])],
      providers: [UserService],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    await repository.query("DELETE FROM public.user");
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('create', () => {
    it('should create user', async () => {
      await service.create({username: 'test123', password: 'test' })
      let [entities, count] = await repository.findAndCountBy({username: 'test123'});
      expect(count).toBe(1);
      expect(entities[0].username).toBe('test123');
      expect(entities[0].password).toBe('test');
    })
  })

  describe('findOne', () => {
    it('should return record when id is valid', async () => {
      const user: User = {username: 'test1', password: 'test'} as User;
      const userRecord = await repository.save(user);
      const expectedResponse =  await service.findOne(userRecord.id);
      expect(expectedResponse).toEqual(userRecord);
    });

    it('should return nothing when id is invalid', async () => {
      const expectedResponse =  await service.findOne(-1);
      expect(expectedResponse).toBeFalsy();
    })
  })

  describe('findOneByUsername', () => {
    it('should return record when username is valid', async () => {
      const user: User = {username: 'test2', password: 'test'} as User;
      const userRecord = await repository.save(user);
      const expectedResponse =  await service.findOneByUsername('test2');
      expect(expectedResponse).toEqual(userRecord);
    });

    it('should return nothing when username does not exist', async () => {
      const expectedResponse =  await service.findOneByUsername('invalid');
      expect(expectedResponse).toBeFalsy();
    })
  })
});
