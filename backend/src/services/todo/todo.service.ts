import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/list/list.entity';
import { Todo } from 'src/todo/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(List) private readonly listRepository: Repository<List>
  ) {}

  createList(userId: number, list: Partial<List>): Promise<List> {
    if(!list.name || !list.name.trim().length) {
      throw new BadRequestException('name cannot be null or empty string');
    }
    const listToCreate = { name: list.name.trim(), user: {id: userId}};
    return this.listRepository.save(listToCreate);
  }
  
  findAllListByUserId(userId: number): Promise<List[]> {
    return this.listRepository.find({where: {user: {id: userId}}, order: {
      createdAt: 'ASC'
    }})
  }

  async findListByUserIdAndListId(userId: number, listId: number): Promise<List> {
    const list = await this.listRepository.findOne({where: {id: listId, user: {id: userId} }, relations: ['todos']});
    if(!list) {
      throw new NotFoundException('list does not exist');
    }
    return list;
  }

  async updateListByUserIdAndListId(userId: number, listId: number, name: string): Promise<List> {
    if(!name || !name.length) {
      throw new BadRequestException('list name must be present');
    }
    const list = await this.findListByUserIdAndListId(userId, listId);
    await this.listRepository.update({ id: listId }, { name } )
    return this.listRepository.findOne({ where: { id: list.id }})
  }

  async deleteListByUserIdAndListId(userId: number, listId: number): Promise<List> {
    const list = this.findListByUserIdAndListId(userId, listId);
    await this.listRepository.delete({ id: listId });
    return list;
  }

  async createTodo(userId: number, listId: number, todo: Partial<Todo>): Promise<Todo> {
    if(!todo.title?.trim().length || (todo.detail && !todo.detail.trim().length)) {
      throw new BadRequestException('title or detail cannot be null');
    }
    await this.findListByUserIdAndListId(userId, listId);
    return this.todoRepository.save({title: todo.title.trim(), detail: todo.detail?.trim(), list: { id: listId }});
  }

  async findOneTodo(userId: number, listId: number, todoId: number): Promise<Todo> {
    await this.findListByUserIdAndListId(userId, listId);
    const todo =  await this.todoRepository.findOne({where: {
      id: todoId, list: { id: listId }
    }});

    if(!todo) {
      throw new NotFoundException('todo does not exist');
    }
    return todo;
  }

  async updateTodo(userId: number, listId: number, todo: Partial<Todo>): Promise<Todo> {
    if(!todo.title?.trim().length || (todo.detail && !todo.detail.trim().length)) {
      throw new BadRequestException('title or detail cannot be null');
    }
    const todoToUpdate = await this.findOneTodo(userId, listId, todo.id);
    await this.todoRepository.update({id: todoToUpdate.id}, { title: todo.title.trim(), detail: todo.detail.trim(), isDone: todo.isDone });
    return this.todoRepository.findOne({ where: { id: todoToUpdate.id }})
  }

  async deleteTodo(userId: number, listId: number, todoId: number): Promise<Todo> {
    const todo = await this.findOneTodo(userId, listId, todoId);
    await this.todoRepository.delete({ id: todo.id })
    return todo;
  }



}
