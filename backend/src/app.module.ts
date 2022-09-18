import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
@Module({

	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			url: process.env.DATABASE_URL,
			autoLoadEntities: true,
			synchronize: true,
		}),
		UserModule,
		AuthModule,
		GameModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
