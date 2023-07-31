import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class UserService {
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

  register(body, session) { 
    if (session?.code?.toUpperCase()!== body?.code?.toUpperCase() ) {
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
    return {
      code: 200,
      msg: '注册成功',
    };
  }
}
