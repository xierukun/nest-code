import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}
  createCode(req, res) {
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      noise: 2, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#cc9966', // 验证码图片背景颜色
      width: 100, // 验证码图片宽度
      height: 40, // 验证码图片高度
      fontSize: 50, // 验证码字符大小
    });
    req.session.code = captcha.text; // session 存储
    res.type('image/svg+xml');
    res.status(200).send(captcha.data);
  }

  async registerVerify(body: CreateUserDto, session): Promise<{ code: number; msg: string }> {
    if (session?.code?.toUpperCase() !== body?.code?.toUpperCase()) {
      return {
        code: 400,
        msg: '验证码错误',
      };
    }
    if (body.password !== body.password2) {
      return {
        code: 400,
        msg: '两次密码不一致',
      };
    }

    // Check if username already exists
    const userExists = await this.checkIfUserExists(body.username);
    if (userExists) {
      return {
        code: 400,
        msg: '用户名已存在',
      };
    }

    // Create user if username does not exist
    await this.createUsers(body);

    return {
      code: 200,
      msg: '注册成功',
    };
  }

  async checkIfUserExists(username: string): Promise<boolean> {
    // 检查数据库中是否已经存在给定用户名的用户
    const user = await this.usersRepository.findOne({ where: { username } });
    return !!user;
  }

  async createUsers(body: CreateUserDto): Promise<void> {
    // Create user
    const user = new User();
    user.username = body.username;
    user.password = body.password;
    await this.usersRepository.save(user);
  }

  async findAllUser(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async removeUser(id: number): Promise<boolean> {
    console.log(id,22);
    try {
      await this.usersRepository.delete(id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
