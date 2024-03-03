import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'src/services/user/user.service';

describe('UserController', () => {
  let controller: UserController;
  let moduleRef: TestingModule;
  let mockService: UserService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    mockService = moduleRef.get<UserService>(UserService);
  });

  afterAll(() => moduleRef.close());

  describe('create', () => {
    it('should call create method', async () => {
      const now = new Date();
      const user = {
        id: 1,
        username: 'user',
        password: 'pass',
        createdAt: now,
        updatedAt: now,
        lists: [],
      };
      jest.spyOn(mockService, 'create').mockResolvedValue(user);
      await controller.create({ username: 'user', password: 'pass' });
      expect(mockService.create).toHaveBeenCalledWith({
        username: 'user',
        password: 'pass',
      });
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });

    it('should raise an error when create fails', async () => {
      jest.spyOn(mockService, 'create').mockImplementation(async () => {
        throw new Error('failed');
      });
      await expect(
        controller.create({ username: 'user', password: 'pass' }),
      ).rejects.toThrow(Error);
      expect(mockService.create).toHaveBeenCalledWith({
        username: 'user',
        password: 'pass',
      });
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should call findOne method', async () => {
      const now = new Date();
      const user = {
        id: 1,
        username: 'user',
        password: 'pass',
        createdAt: now,
        updatedAt: now,
        lists: [],
      };
      jest.spyOn(mockService, 'findOne').mockResolvedValue(user);
      await controller.findOne(1);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should raise an error when findOne fails', async () => {
      jest.spyOn(mockService, 'findOne').mockImplementation(async () => {
        throw new Error('failed');
      });
      await expect(controller.findOne(1)).rejects.toThrow(Error);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(mockService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
