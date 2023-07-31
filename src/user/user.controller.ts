import { Controller, Get, Post, Body, Req, Res,Session } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('code')
  getCode(@Req() req, @Res() res) {
    return this.userService.createCode(req, res);
  }
  @Post('register')
  register(@Body() body, @Session() session) {
    console.log(body, session.code);
    return this.userService.register(body, session);
  }
}
