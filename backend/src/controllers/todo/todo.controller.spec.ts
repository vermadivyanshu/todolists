import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from 'src/services/todo/todo.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';

describe('TodoController', () => {
  let controller: TodoController;
  let mockTodoService: TodoService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
     imports: [JwtModule],
      providers: [{
        provide: TodoService,
        useValue: {
          createTodo: jest.fn(),
          updateTodo: jest.fn(),
          deleteTodo: jest.fn(),
        },
      }, {
        provide: AuthGuard,
        useValue: {
          canActivate: jest.fn().mockImplementation(() => true)
        }
      }],
      controllers: [TodoController],
    }).compile();

    controller = moduleRef.get<TodoController>(TodoController);
    mockTodoService = moduleRef.get<TodoService>(TodoService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('createTodo', () => {
    it('should call createTodo successfully', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      const todo = {id: 1, title: 'todo', detail:'detail', isDone: false, list: list, createdAt: now, updatedAt: now }
      jest.spyOn(mockTodoService, 'createTodo').mockResolvedValue(todo);
      await controller.createTodo({user: {userId: 1}},
        {listId:1, title: 'todo', detail: 'detail' })
      expect(mockTodoService.createTodo).toHaveBeenCalledTimes(1);
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(1, 1, {listId: 1, title: 'todo', detail: 'detail'});
    });

    it('should fail when createTodo throws an error', async () => {
      jest.spyOn(mockTodoService, 'createTodo').mockImplementation(async () => {
        throw new Error('failed');
      });
      await expect(controller.createTodo({user: {userId: 1}},
        {listId:1, title: 'todo', detail: 'detail' })).rejects.toThrow(Error);
      expect(mockTodoService.createTodo).toHaveBeenCalledTimes(1);
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(1, 1, {listId: 1,title: 'todo', detail: 'detail'});
    });

  });

  describe('updateTodo', () => {
    it('should call updateTodo successfully', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      const todo = {id: 1, title: 'todo', detail:'detail', isDone: false, list: list, createdAt: now, updatedAt: now }
      jest.spyOn(mockTodoService, 'updateTodo').mockResolvedValue(todo);
      await controller.updateTodo({user: {userId: 1}}, 1, {listId: 1, title: 'todo', detail: 'detail', isDone: true })
      expect(mockTodoService.updateTodo).toHaveBeenCalledTimes(1);
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith(1, 1, {id: 1, title: 'todo', detail: 'detail', isDone: true });
    });

    it('should fail when updateTodo throws an error', async () => {
      jest.spyOn(mockTodoService, 'updateTodo').mockImplementation(async () => {
        throw new Error('failed');
      });
      await expect(controller.updateTodo({user: {userId: 1}}, 1,
        {listId: 1, title: 'todo', detail: 'detail', isDone: true })).rejects.toThrow(Error);
        expect(mockTodoService.updateTodo).toHaveBeenCalledTimes(1);
        expect(mockTodoService.updateTodo).toHaveBeenCalledWith(1, 1, {id: 1, title: 'todo', detail: 'detail', isDone: true });
    });
  });

  describe('deleteTodo', () => {
    it('should call deleteTodo successfully', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      const todo = {id: 1, title: 'todo', detail:'detail', isDone: false, list: list, createdAt: now, updatedAt: now }
      jest.spyOn(mockTodoService, 'deleteTodo').mockResolvedValue(todo);
      await controller.deleteTodo({user: {userId: 1}}, 1, 1)
      expect(mockTodoService.deleteTodo).toHaveBeenCalledTimes(1);
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(1, 1, 1);
    });

    it('should fail when deleteTodo throws an error', async () => {
      jest.spyOn(mockTodoService, 'deleteTodo').mockImplementation(async () => {
        throw new Error('failed');
      });
      await expect(controller.deleteTodo({user: {userId: 1}}, 1, 1)).rejects.toThrow(Error);
        expect(mockTodoService.deleteTodo).toHaveBeenCalledTimes(1);
        expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(1, 1, 1);
    });

  });
});
