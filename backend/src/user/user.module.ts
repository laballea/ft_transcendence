import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, GameData, Message, Muted, User, Room } from './models/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EventsService } from './events.service';
import { UserGateway } from './user.gateway';
import { FriendsService } from 'src/friends/friends.service';
import { GameModule } from 'src/game/game.module';

@Module({
	imports:[
		TypeOrmModule.forFeature([User, Message, Muted, Conversation, GameData, Room]),
		AuthModule,
		forwardRef(() => GameModule),
	],
	providers: [UserService, EventsService, UserGateway, FriendsService],
	controllers: [UserController],
	exports:[UserService]
})
export class UserModule {}
