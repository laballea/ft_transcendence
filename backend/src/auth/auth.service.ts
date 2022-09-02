import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { Repository, getConnection } from 'typeorm';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { UserService } from 'src/user/user.service';
import { HTTP_STATUS, status} from 'src/common/types';

@Injectable()
export class AuthService {
	@InjectRepository(User)
	private readonly repository: Repository<User>;
	@Inject(UserService)
	private readonly userService: UserService;
	@Inject(AuthHelper)
	private readonly helper: AuthHelper;

	// --------------------------------------------------------------------------------------------------
	/*
		create user in db, if username exist return HTTP C409 (CONFLICT)
	*/
	public async register(body: RegisterDto): Promise<User | never> {
		const { username }: RegisterDto = body;
		let user: User = await this.repository.findOne({ where: { username } });
		console.log("step2");
		if (user) 
			throw new HttpException(HTTP_STATUS.ALREADY_EXIST, HttpStatus.CONFLICT);
		user = new User();
		user.username = username;
		console.log("step2 bis", username);
		return this.repository.save(user);
	}

	/*
		login user if user exist in db, else create it, update status of user, return JWT token
	*/
	public async login(body: LoginDto): Promise<Object | never> {
		const { username }: LoginDto = body;
		var user: User = await this.repository.findOne({ where: { username } });
		console.log("step1");
		if (!user) {
			await this.register(body);
			user = await this.repository.findOne({ where: { username } });
		}
		if (this.userService.getUserStatus(user.id) != status.Disconnected)
			throw new HttpException(HTTP_STATUS.ALREADY_CONNECTED, HttpStatus.CONFLICT);
		return {token:this.helper.generateToken(user)};
	}
	// --------------------------------------------------------------------------------------------------

	public createToken(user: User): string{
		console.log("2 step");
		let tmp = this.helper.generateToken(user);
		return tmp;
	}

	public async registerIntra(userData: any): Promise<User | never> {
		var user: User = new User();
		user.username = userData.login;
		user.intraID = userData.id;
		user.profilIntraUrl = userData.image_url;
		return this.repository.save(user);
	}

	public async loginIntra(userData: any): Promise<Object | never> {
		var user: User = await this.userService.findUserByIntra(userData.id);
		if (!user)
			user = await this.registerIntra(userData);
		return user;
	}

	public async validToken(jwt: string): Promise<boolean> {
		return this.helper.validate(jwt);
	}

	// public async refresh(user: User): Promise<string> {
	// 	console.log("service refreshaa")
	// 	return this.helper.generateToken(user);
	// }
}
