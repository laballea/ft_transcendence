import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		//forwardRef(() => UserGateway)
		forwardRef(() => UserModule),
		TypeOrmModule.forFeature([User]),

	],
	controllers: [GameController],
	providers: [GameService],
	exports:[GameService]
})
export class GameModule {}