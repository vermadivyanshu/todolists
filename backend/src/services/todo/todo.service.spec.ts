import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/typeorm.config.test';
import { User } from 'src/user/user.entity';
import { List } from 'src/list/list.entity';
import { Todo } from 'src/todo/todo.entity';
import { Repository } from 'typeorm';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;
  let listRepository: Repository<List>;
  let userRepository: Repository<User>;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([User, List, Todo])
      ],
      providers: [TodoService],
    }).compile();

    service = moduleRef.get<TodoService>(TodoService);
    todoRepository = moduleRef.get<Repository<Todo>>(getRepositoryToken(Todo));
    listRepository = moduleRef.get<Repository<List>>(getRepositoryToken(List));
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await todoRepository.query('DELETE FROM public.todo');
    await listRepository.query('DELETE FROM public.list');
    await userRepository.query('DELETE FROM public.user');
  })

  afterAll(() => {
    moduleRef.close();
  });

  describe('createList', () => {
    it('should create a list', async () => {
      let user = await userRepository.save({username: 'test-1', password: 'test'});
      const listRecord = await service.createList(user.id, {name: 'list'});
      let [listEntities, count] = await listRepository.findAndCountBy({
        user: {id: user.id }
      });
      expect(count).toBe(1);
      delete listRecord.user;
      expect(listEntities[0]).toEqual(listRecord);
    });

  });

  describe('findAllListByUserId', () => {
    it('should find all lists for user', async () => {
      let user = await userRepository.save({username: 'testy', password: 'test'});
      const list = await listRepository.save({name: 'list', user: {id: user.id}});
      const list2 = await listRepository.save({name: 'list2', user: {id: user.id}});
      delete list.user;
      delete list2.user;
      const lists = [list, list2];
      const expectedResponse = await service.findAllListByUserId(user.id);
      expect(lists).toEqual(expectedResponse);
    })
    it('should return empty array for invalid user', async () => {
      const expectedResponse = await service.findAllListByUserId(-1);
      expect(expectedResponse).toEqual([]);
    })
  });

  describe('findListByUserIdAndListId', () => {
    it('should find list that belongs to the user', async () => {
      const user = await userRepository.save({username: 'testk', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user.id }});
      const todo = await todoRepository.save({title:'todo', detail: 'todo', list: {id: list.id }});
      const expectedResponse = await service.findListByUserIdAndListId(user.id, list.id);
      delete todo.list;
      delete list.user;
      expect(expectedResponse).toEqual({...list, todos: [todo] });
    });

    it('should return null when the list and user are not linked', async () => {
      const user = await userRepository.save({username: 'test9', password: 'user'});
      const user2 = await userRepository.save({username: 'test2k', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user2.id }});
      await expect(service.findListByUserIdAndListId(user.id, list.id)).rejects.toThrow('list does not exist');
    })
  });

  describe('updateListByUserIdAndListId', () => {
    it('should update the list name', async () => {
      const user = await userRepository.save({username: 'test-0', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user.id }});
      const expectedResponse = await service.updateListByUserIdAndListId(user.id, list.id, 'list-update');
      expect(expectedResponse.name).toEqual('list-update');
      expect(expectedResponse.id).toEqual(list.id);
    });

    it('should throw error when name is an empty string', async () => {
      const user = await userRepository.save({username: 'test-8', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user.id }});
      await expect(service.updateListByUserIdAndListId(user.id, list.id, '')).rejects.toThrow('list name must be present');

    });

    it('should throw an error when list does not exist', async () => {
      const user = await userRepository.save({username: 'test-09', password: 'user'});
      const user2 = await userRepository.save({username: 'test26', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user2.id }});
      await expect(service.updateListByUserIdAndListId(user.id, list.id, 'update')).rejects.toThrow('list does not exist');
    });
  })

  describe('deleteListByUserIdAndListId', () => {
    it('should remove the list', async () => {
      const user = await userRepository.save({username: 'test23', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user.id }});
      await service.deleteListByUserIdAndListId(user.id, list.id);
      const count = await listRepository.count();
      expect(count).toBe(0);
    });

    it('should throw an error when list is not found', async () => {
      const user = await userRepository.save({username: 'test78', password: 'user'});
      const user2 = await userRepository.save({username: 'test62', password: 'user'});
      const list = await listRepository.save({name: 'list', user: { id: user2.id }});
      await expect(service.deleteListByUserIdAndListId(user.id, list.id)).rejects.toThrow('list does not exist');
    });
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const user = await userRepository.save({username: 'test2j', password: 'user'});
      const list = await listRepository.save({name: 'list-1', user: { id: user.id }});
      const expectedResponse =  await service.createTodo(user.id, list.id, {title: ' test ', detail: ' test ' });
      const [entities, count] = await todoRepository.findAndCountBy({ list: {id: list.id }});
      expect(count).toBe(1);
      delete expectedResponse.list;
      expect(entities[0]).toEqual(expectedResponse);
    });

    it('should throw an error when title is empty', async () => {
      const user = await userRepository.save({username: 'test2o', password: 'user'});
      const list = await listRepository.save({name: 'list09', user: { id: user.id }});
      await expect(service.createTodo(user.id, list.id, {title: ' ', detail: ' ' })).rejects.toThrow('title or detail cannot be null')

    });

    it('should throw an error when list is not present', async () => {
      const user = await userRepository.save({username: 'test2l', password: 'user'});
      const user2 = await userRepository.save({username: 'test1', password: 'user'});
      const list = await listRepository.save({name: 'list78', user: { id: user2.id }});
      await expect(service.createTodo(user.id, list.id, {title: 'test', detail: 'test' })).rejects.toThrow('list does not exist')
    });
  });

  describe('findOneTodo', () => {
    let user, list, todo;
    beforeEach(async () => {
      user = await userRepository.save({username: 'test2q', password: 'user'});
      list = await listRepository.save({name: 'list', user: { id: user.id }});
      todo = await todoRepository.save({title: 'todo', detail: 'todo', list: {id: list.id}});
    });

    it('should find todo', async () => {
      const expectedResponse = await service.findOneTodo(user.id, list.id, todo.id); 
      expect(expectedResponse.id).toEqual(todo.id);
      expect(expectedResponse.title).toEqual(todo.title);
      expect(expectedResponse.detail).toEqual(todo.detail); 
    });

    it('should throw an error when list does not exist', async () => {
      let user1 = await userRepository.save({username: 'testj1', password: 'user'});
      let list2 = await listRepository.save({name: 'list', user: { id: user.id }});
      let todo = await todoRepository.save({title: 'todo', detail: 'todo', list: {id: list2.id}});
      await expect(service.findOneTodo(user1.id, list.id, todo.id)).rejects.toThrow('list does not exist');
    });

    it('should throw an error when todo is invalid does not exist', async () => {
      await expect(service.findOneTodo(user.id, list.id, -1)).rejects.toThrow('todo does not exist');
    });

  });

  describe('deleteTodo', () => {
    it('should delete the todo', async () => {
      let user = await userRepository.save({username: 'testh2', password: 'user'});
      let list = await listRepository.save({name: 'list', user: { id: user.id }});
      let todo = await todoRepository.save({title: 'todo', detail: 'todo', list: {id: list.id}});
      await service.deleteTodo(user.id, list.id, todo.id);
      const [entities, count] = await todoRepository.findAndCountBy({id: todo.id, list: {id: list.id}});
      expect(count).toBe(0);
      expect(entities).toEqual([]);
    });

    it('should throw an error when todo.id is invalid', async () => {
      let user = await userRepository.save({username: 'test2g', password: 'user'});
      let list = await listRepository.save({name: 'list', user: { id: user.id }});
      await expect(service.deleteTodo(user.id, list.id, -1)).rejects.toThrow('todo does not exist')
    });
  });

  describe('updateTodo', () => {
    let user, list, todo;
  
    beforeEach(async () => {
      user = await userRepository.save({username: 'test2d', password: 'user'});
      list = await listRepository.save({name: 'list', user: { id: user.id }});
      todo = await todoRepository.save({title: 'todo', detail: 'todo', list: {id: list.id}});
    });

    it('should update todo when title and detail are present', async () => {
      const expectedResponse = await service.updateTodo(user.id, list.id, {id: todo.id, title: ' update ', detail: ' detail ', isDone: true});
      expect(expectedResponse.isDone).toBeTruthy();
      expect(expectedResponse.title).toEqual('update');
      expect(expectedResponse.detail).toEqual('detail');
    });

    it('should throw an error when title or detail are empty', async () => {
      await expect(service.updateTodo(user.id, list.id, {id: todo.id, title: ' ', detail: ' ', isDone: true}))
      .rejects
      .toThrow('title or detail cannot be null');
    });

    it('should throw an error when todo is not found', async () => {
      await expect(service.updateTodo(user.id, list.id, {id: -1, title: 'title! ', detail: 'detail! ', isDone: true}))
      .rejects
      .toThrow('todo does not exist');
    })
  })

});
