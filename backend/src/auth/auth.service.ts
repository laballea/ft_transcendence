import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/models/user.entity';
import { Repository, getConnection, Not, IsNull } from 'typeorm';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { UserService } from 'src/user/user.service';
import { HTTP_STATUS, status} from 'src/common/types';

let s4 = () => {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
  }

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
		let user: User = await this.repository.findOne({ where: { username, testID:Not(IsNull()) } });
		if (user) 
			throw new HttpException(HTTP_STATUS.ALREADY_EXIST, HttpStatus.CONFLICT);
		user = new User();
		user.username = username;
		user.lvl = 0;
		user.testID = s4()
		user.profilPic = `http://${process.env.REACT_APP_ip}:5000/users/image/default.png`;
		return this.repository.save(user);
	}

	/*
		login user if user exist in db, else create it, update status of user, return JWT token
	*/
	public async login(body: LoginDto): Promise<Object | never> {
		const { username }: LoginDto = body;
		var user: User = await this.repository.findOne({ where: { username, testID:Not(IsNull()) } });
		if (!user) {
			await this.register(body);
			user = await this.repository.findOne({ where: { username, testID:Not(IsNull()) } });
		}
		if (this.userService.getUserStatus(user.id) != status.Disconnected)
			throw new HttpException(HTTP_STATUS.ALREADY_CONNECTED, HttpStatus.CONFLICT);
		return {token:this.helper.generateToken(user), user:user};
	}
	// --------------------------------------------------------------------------------------------------

	public createToken(user: User): string{
		let tmp = this.helper.generateToken(user);
		return tmp;
	}

	public async registerIntra(userData: any, accessToken:string): Promise<User | never> {
		var user: User = new User();
		user.username = userData.login;
		user.lvl = 0;
		user.intraID = userData.id;
		user.profilPic = userData.image_url;
		user.savedProfilPic = userData.image_url;
		user.token42 = accessToken
		return this.repository.save(user);
	}

	public async registerGoogle(userData: any, accessToken:string): Promise<User | never> {
		var user: User = new User();
		user.username = userData.displayName;
		user.lvl = 0;
		user.profilPic = userData.picture;
		user.savedProfilPic = userData.picture;
		user.googleID = userData.id;
		return this.repository.save(user);
	}

	public async registerDiscord(userData: any, accessToken:string): Promise<User | never> {
		var user: User = new User()
		user.username = userData.username
		user.lvl = 0
		user.profilPic = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
		user.savedProfilPic = user.profilPic
		user.discordID = userData.id;

		return this.repository.save(user)
	}

	public async loginIntra(userData: any, accessToken:string): Promise<Object | never> {
		var user: User = await this.userService.findUserByIntra(userData.id);
		if (!user)
			user = await this.registerIntra(userData, accessToken)
		else {
			user.token42 = accessToken
			await this.repository.save(user)
		}
		return user;
	}

	public async loginGoogle(userData: any, accessToken:string): Promise<Object | never> {
		var user: User = await this.userService.findUserByGoogleId(userData.id)
		if (!user)
			user = await this.registerGoogle(userData, accessToken)
		return user;
	}

	public async loginDiscord(userData: any, accessToken:string): Promise<Object | never> {
		var user: User = await this.userService.findUserByDiscordId(userData.id)
		if (!user)
			user = await this.registerDiscord(userData, accessToken)
		return user;
	}

	public async validToken(jwt: string): Promise<boolean> {
		return this.helper.validate(jwt);
	}

	// public async refresh(user: User): Promise<string> {
	// 	return this.helper.generateToken(user);
	// }
}
