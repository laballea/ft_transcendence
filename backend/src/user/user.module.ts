import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EventsService } from './events.service';
import { UserGateway } from './user.gateway';

@Module({
	imports:[
		TypeOrmModule.forFeature([UserEntity]),
		AuthModule
	],
	providers: [UserService, EventsService, UserGateway],
	controllers: [UserController],
	exports:[UserService]
})
export class UserModule {}
