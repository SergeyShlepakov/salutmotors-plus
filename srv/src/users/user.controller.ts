import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  /** The number of items returned in the response list */
  private readonly take = 20;
  constructor(private userService: UserService) {}

  @Get('/all')
  async getAllUsers() {
    this.logger.log('Get all users');
    const users = await this.userService.findAll();
    return users.map((user) => UsersResponseDto.fromUsersEntity(user));
  }

  @Get()
  async getUsersPerPage(@Query() query) {
    let skip = 0;
    if (query?.page > 0) {
      skip = (query.page - 1) * this.take;
    }
    const userList = await this.userService.findAndCount(this.take, skip);
    return {
      count: userList[1],
      users: userList[0].map((user) => UsersResponseDto.fromUsersEntity(user)),
    };
  }
}
