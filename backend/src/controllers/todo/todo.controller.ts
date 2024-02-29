import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TodoService } from 'src/services/todo/todo.service';
import { Todo } from 'src/todo/todo.entity';
import { TodoDto } from './todo.dto';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {

  constructor(private todoService: TodoService) {}

  @Post()
  async createTodo(@Request() request, @Body()todo: TodoDto): Promise<Todo> {
    return this.todoService.createTodo(request.user.userId, todo.listId, todo)
  }

  @Patch(':id')
  async updateTodo(@Request() request, @Param('id')id: number, @Body()todo: TodoDto): Promise<Todo> {
    return this.todoService.updateTodo(request.user.userId, todo.listId, {
      id, title: todo.title, detail: todo.detail
    })
  }

  @Delete(':listId/:id')
  async deleteTodo(@Request() request,@Param('listId')listId: number,  @Param('id')id: number): Promise<Todo> {
    return this.todoService.deleteTodo(request.user.userId, listId, id);
  }
}
