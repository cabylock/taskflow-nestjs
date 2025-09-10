import { Body, Controller } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.schema';
import { Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: User) {
    return this.userService.register(user);
  }

  @Post('login')
  async login(@Body() user: User) {
    return this.userService.login(user);
  }

  @Post('login_google')
  async login_google(@Body() jwt: any) {
    return this.userService.login_google(jwt);
  }

  @Post('update')
  async update(@Body() user: User) {
    return this.userService.update(user);
  }

  @Post('get_user')
  async get_user(@Body() user: User) {
    return this.userService.get_user(user);
  }
}
