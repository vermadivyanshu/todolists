import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Todo } from 'src/todo/todo.entity';
import { TodoService } from 'src/services/todo/todo.service';
import { ListController } from 'src/controllers/list/list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([List, Todo])],
  providers: [TodoService],
  controllers: [ListController]
})
export class ListModule {}
