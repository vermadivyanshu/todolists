import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { TodoService } from 'src/services/todo/todo.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TodoController } from '../todo/todo.controller';

describe('ListController', () => {
  let controller: ListController;
  let mockTodoService: TodoService;
  let moduleRef: TestingModule;
  let mockAuthGuard: AuthGuard

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [{
        provide: TodoService,
        useValue: {
          createList: jest.fn(),
          findAllListByUserId: jest.fn(),
          findListByUserIdAndListId: jest.fn(),
          deleteListByUserIdAndListId: jest.fn(),
          updateListByUserIdAndListId: jest.fn()
        },
      }, {
        provide: AuthGuard,
        useValue: {
          canActivate: jest.fn()
        }
      }],
      controllers: [ListController]
    }).compile();

    controller = moduleRef.get<ListController>(ListController);
    mockTodoService = moduleRef.get<TodoService>(TodoService);
    mockAuthGuard = moduleRef.get<AuthGuard>(AuthGuard);

  });

  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe('create', () => {
    const now = new Date()
    const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
    const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
    it('should create list when the user is authenticated', async () => {  
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'createList').mockResolvedValue(list);
      await controller.createList({user: {userId: 1}}, {name: 'list'})
      expect(mockTodoService.createList).toHaveBeenCalledTimes(1);
      expect(mockTodoService.createList).toHaveBeenCalledWith(1, {name: 'list'});
    });

    it('should throw an error when service fails', async () => {
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'createList').mockImplementation(async () => {
        throw new Error('failed');
      });
      await expect(controller.createList({user: {userId: 1}}, {name: 'list'})).rejects.toThrow(Error);
    });
  });

  describe('findAllListByUserId', () => {
    it('should find all lists for the user', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'findAllListByUserId').mockResolvedValue([list]);
      await controller.findAllByUserId({user: {userId: 1}})
      expect(mockTodoService.findAllListByUserId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.findAllListByUserId).toHaveBeenCalledWith(1);
    })

    it('should throw an error when service fails', async () => {
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'findAllListByUserId').mockImplementation(async () => { throw new Error('failed'); }); 
      await expect(controller.findAllByUserId({user: {userId: 1}})).rejects.toThrow(Error)
      expect(mockTodoService.findAllListByUserId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.findAllListByUserId).toHaveBeenCalledWith(1);
    })
  })

  describe('findByUserIdAndListId', () => {
    it('should find list for the user and list id', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'findListByUserIdAndListId').mockResolvedValue(list);
      await controller.findByUserIdAndListId({user: {userId: 1}}, 1)
      expect(mockTodoService.findListByUserIdAndListId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.findListByUserIdAndListId).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error when service fails', async () => {
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'findListByUserIdAndListId').mockImplementation(async () => { throw new Error('failed'); }); 
      await expect(controller.findByUserIdAndListId({user: {userId: 1}}, 1)).rejects.toThrow(Error)
      expect(mockTodoService.findListByUserIdAndListId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.findListByUserIdAndListId).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('deleteListByListIdAndUserId', () => {
    it('should find list for the user and list id', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'deleteListByUserIdAndListId').mockResolvedValue(list);
      await controller.deleteListByListIdAndUserId({user: {userId: 1}}, 1)
      expect(mockTodoService.deleteListByUserIdAndListId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.deleteListByUserIdAndListId).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error when service fails', async () => {
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'deleteListByUserIdAndListId').mockImplementation(async () => { throw new Error('failed'); }); 
      await expect(controller.deleteListByListIdAndUserId({user: {userId: 1}}, 1)).rejects.toThrow(Error)
      expect(mockTodoService.deleteListByUserIdAndListId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.deleteListByUserIdAndListId).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('updateList', () => {
    it('should find list for the user and list id', async () => {
      const now = new Date()
      const user = {id: 1, username: 'user', password:'pass', createdAt: now, updatedAt: now, lists: []}
      const list = {id: 1, name: 'list', todos: [], user, createdAt: now, updatedAt: now}
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'updateListByUserIdAndListId').mockResolvedValue(list);
      await controller.updateList({user: {userId: 1}}, {name: 'test'}, 1)
      expect(mockTodoService.updateListByUserIdAndListId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.updateListByUserIdAndListId).toHaveBeenCalledWith(1, 1, 'test');
    })

    it('should throw an error when service fails', async () => {
      jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(mockTodoService, 'updateListByUserIdAndListId').mockImplementation(async () => { throw new Error('failed'); });
      await expect(controller.updateList({user: {userId: 1}}, {name: 'test'}, 1)).rejects.toThrow(Error)
      expect(mockTodoService.updateListByUserIdAndListId).toHaveBeenCalledTimes(1);
      expect(mockTodoService.updateListByUserIdAndListId).toHaveBeenCalledWith(1, 1, 'test');
    })
  })
});
