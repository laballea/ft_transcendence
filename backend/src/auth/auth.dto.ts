import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
	@IsString()
	public readonly username: string;
}

export class LoginDto {
	@IsString()
	public readonly username: string;
}

export class TwoFactorAuthenticationCodeDto {
	@ApiProperty()
	@IsString()
	code: string
}