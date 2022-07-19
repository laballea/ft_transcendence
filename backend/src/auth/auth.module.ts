import { Module , forwardRef} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService, JwtTwoFactorStrategy } from './auth.service';
import { JwtStrategy } from './auth.strategy';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { HttpModule } from '@nestjs/axios';
import { IntraStrategy } from './intra.strategy';
import { SessionSerializer } from './auth.serializer';
import { UserModule } from 'src/user/user.module';
import { TwoFactorAuthenticationController } from '../twoFactor/tfa.controller';
import { TwoFactorAuthenticationService } from '../twoFactor/tfa.service';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
		JwtModule.registerAsync({
		inject: [ConfigService],
		useFactory: (config: ConfigService) => ({
			secret: process.env.SECRET_KEY || "randomString",
			signOptions: { expiresIn: '60s' },
		}),
		}),
		HttpModule,
		forwardRef(() => UserModule),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [AuthController, TwoFactorAuthenticationController],
	providers: [
		AuthService,
		TwoFactorAuthenticationService,
		AuthHelper,
		JwtStrategy,
		IntraStrategy,
		JwtTwoFactorStrategy,
		SessionSerializer],
})
export class AuthModule {}