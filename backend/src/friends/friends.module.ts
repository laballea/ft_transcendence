import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';


@Module({
	imports:[],
	providers: [UserService],
})
export class UserModule {}
