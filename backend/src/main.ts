import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { SocketIOAdapter } from './socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    }});
  app.enableCors();
  app.useWebSocketAdapter(
    new SocketIOAdapter(app, [`${process.env.REACT_APP_BACK_IP}`]),
  );
  app.use(
	session({
	  secret: 'my-secret',
	  resave: false,
	  saveUninitialized: false,
	}));
  await app.listen(443);
}
bootstrap();
