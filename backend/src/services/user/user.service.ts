import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  findOne(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: {id: userId }})
  }
  
  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username }})
  }
}
