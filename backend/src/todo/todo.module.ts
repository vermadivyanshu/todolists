import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodoService } from 'src/services/todo/todo.service';
import { TodoController } from 'src/controllers/todo/todo.controller';
import { List } from 'src/list/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, List])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
