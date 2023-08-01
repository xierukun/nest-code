import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Param,
  Session,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('code')
  getCode(@Req() req, @Res() res) {
    return this.userService.createCode(req, res);
  }

  @Post('register')
  register(@Body() body: CreateUserDto, @Session() session) {
    return this.userService.registerVerify(body, session);
  }

  @Get('list')
  async findAll(): Promise<User[]> {
    return this.userService.findAllUser();
  }

  @Post('delete')
  @HttpCode(204)
  async delete(@Body() body): Promise<boolean> {
    console.log(body, 99);
    const success = await this.userService.removeUser(parseInt(body.id));
    if (success) {
      return true;
    } else {
       throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
