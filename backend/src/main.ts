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
    new SocketIOAdapter(app, ['http://localhost', `${process.env.REACT_APP_ip}`]),
  );
  app.use(
	session({
	  secret: 'my-secret',
	  resave: false,
	  saveUninitialized: false,
	}));
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
