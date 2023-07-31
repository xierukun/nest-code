import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'Xierukun',// 用来对session id相关的cookie进行签名
      name: 'xierukun.com', // 设置 cookie 中保存 session id 的字段名称
      cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false  }, // 设置存放 session id 的 cookie 的相关选项
    }),
  );
  await app.listen(3000);
}
bootstrap();
