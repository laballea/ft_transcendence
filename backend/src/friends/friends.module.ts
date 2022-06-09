import { Module , forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { FriendsService } from './friends.service';

@Module({
	imports: [
		/*forwardRef(() => UserModule),
		TypeOrmModule.forFeature([User]),*/
	],
	controllers: [],
	providers: [],
	exports:[FriendsService]
})
export class AuthModule {}