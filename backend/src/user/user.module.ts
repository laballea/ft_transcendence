import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message, User } from './models/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EventsService } from './events.service';
import { UserGateway } from './user.gateway';
import { FriendsService } from 'src/friends/friends.service';

@Module({
	imports:[
		TypeOrmModule.forFeature([User, Message, Conversation]),
		AuthModule,
	],
	providers: [UserService, EventsService, UserGateway, FriendsService],
	controllers: [UserController],
	exports:[UserService]
})
export class UserModule {}
