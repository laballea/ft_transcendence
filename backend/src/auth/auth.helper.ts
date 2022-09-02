import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/models/user.entity';
import { UserI } from '../user/models/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthHelper {
	@InjectRepository(User)
	private readonly repository: Repository<UserI>;

	private readonly jwt: JwtService;

	constructor(jwt: JwtService) {
		this.jwt = jwt;
	}

	// Decoding the JWT Token
	public async decode(token: string): Promise<unknown> {
		return this.jwt.decode(token, null);
	}

	// Get User by User ID we get from decode()
	public async validateUser(decoded: any): Promise<UserI> {
		return this.repository.findOne({ where:{id: decoded.id} });
	}

	// Generate JWT Token
	public generateToken(user: UserI): string {
		return this.jwt.sign({ id: user.id, username: user.username });
	}

	// Validate User's password
	public isPasswordValid(password: string, userPassword: string): boolean {
		return bcrypt.compareSync(password, userPassword);
	}

	// Encode User's password
	public encodePassword(password: string): string {
		const salt: string = bcrypt.genSaltSync(10);

		return bcrypt.hashSync(password, salt);
	}

	// Validate JWT Token, throw forbidden error if JWT Token is invalid
	public async validate(token: string): Promise<boolean | never> {
		const decoded: unknown = this.jwt.verify(token);
		if (!decoded)
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

		const user: UserI = await this.validateUser(decoded);
		if (!user) 
			throw new UnauthorizedException();

		return true;
	}
}
