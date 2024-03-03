import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from 'src/services/todo/todo.service';
import { ListDto } from './list.dto';
import { List } from 'src/list/list.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('lists')
export class ListController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createList(@Request() request, @Body() list: ListDto): Promise<List> {
    return this.todoService.createList(request.user.userId, {
      name: list.name,
    });
  }

  @Get()
  findAllByUserId(@Request() request): Promise<List[]> {
    return this.todoService.findAllListByUserId(request.user.userId);
  }
  @Get(':id')
  findByUserIdAndListId(
    @Request() request,
    @Param('id') id: number,
  ): Promise<List> {
    return this.todoService.findListByUserIdAndListId(request.user.userId, id);
  }

  @Delete(':id')
  deleteListByListIdAndUserId(
    @Request() request,
    @Param('id') id: number,
  ): Promise<List> {
    return this.todoService.deleteListByUserIdAndListId(
      request.user.userId,
      id,
    );
  }

  @Patch(':id')
  updateList(
    @Request() request,
    @Body() list: Partial<List>,
    @Param('id') id: number,
  ): Promise<List> {
    return this.todoService.updateListByUserIdAndListId(
      request.user.userId,
      id,
      list.name,
    );
  }
}
