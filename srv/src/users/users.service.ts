import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }

  /**
   * Returns an array containing a list of items and the number of all items in the list.
   * @param take
   * @param skip
   */
  async findAndCount(take: number, skip: number): Promise<[UsersEntity[], number]> {
    return await this.usersRepo.findAndCount({ take: take, skip: skip });
  }
}
