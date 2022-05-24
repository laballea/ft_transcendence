import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, getConnection } from 'typeorm';
import { UserEntity, status } from './models/user.entity';
import { UserI } from './models/user.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	){}

	findAll():Promise<UserI[]> {
		return this.userRepository.find();
	}

	findOne(username: string):Promise<UserI | undefined> {
		return this.userRepository.findOne({ username });
	}

	async logout(id: number):Promise<string> {
		await getConnection()
			.createQueryBuilder()
			.update(UserEntity)
			.set({ status: status.Disconnected })
			.where("id = :id", { id: id })
			.execute();
		return "ok";
	}

	async getContactList(username: string):Promise<UserI[]>{
		const list = await this.userRepository.find();
		list.splice(list.findIndex(object => {return object.username === username}), 1);
		return list;
	}
}
