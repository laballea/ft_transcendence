import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {

  @IsString()
  public readonly username: string;
}

export class LoginDto {
	@IsString()
	public readonly username: string;
}