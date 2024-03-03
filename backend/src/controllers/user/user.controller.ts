import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/user/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }
}
