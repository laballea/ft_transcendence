import { Injectable } from '@nestjs/common';
import { POPUP_DATA } from 'src/common/types';
import { User } from '../user/models/user.entity';
import { truncateString } from 'src/common/utils';

@Injectable()
export class FriendsService {
	constructor(
		
	){}

	/* 
	*/
	add(send:User, recv:User):POPUP_DATA{
		if(send.id === recv.id){
			return ({
				error:true,
				message:`You are so alone wtf.`,
			})
		}
		if (!recv.friendsRequest.includes(send.id) && //is user already in friend request
			!recv.friends.includes(send.id)) //is user already a friend
		{
				recv.friendsRequest.push(send.id); //add user to friend request
				send.pendingRequest.push(recv.id); //add user to pending request
				return ({
					error:false,
					message:`Friend request send to ${truncateString(recv.username, 10)}.`,
				})
		} else {
			return ({
				error:true,
				message:recv.friendsRequest.includes(send.id) ?
						`Friend request already send to ${truncateString(recv.username, 10)}.`
						:
						`${truncateString(recv.username, 10)} is already your friend.`
						,
			})
		}
	}
	/* 
	*/
	remove(send:User, recv:User):POPUP_DATA{
		if (send.friends.includes(recv.id))
			send.friends.splice(send.friends.indexOf(recv.id), 1);
		else {
			return ({
				error:true,
				message:`${truncateString(recv.username, 10)} is not your friend.`,
			})
		}
		if (recv.friends.includes(send.id))
			recv.friends.splice(recv.friends.indexOf(send.id), 1);
		return ({
			error:false,
			message:`${truncateString(recv.username, 10)} is no longer your friend.`,
		})
	}
	/* 
	*/
	accept(send:User, recv:User){
		if (!recv.friends.includes(send.id)) // not already a friend
			recv.friends.push(send.id);
		if (!send.friends.includes(recv.id))// not already a friend
			send.friends.push(recv.id);
		/* remove friend request if exist */
		if (send.friendsRequest.includes(recv.id)) {
			send.friendsRequest.splice(send.friendsRequest.indexOf(recv.id), 1);
			recv.pendingRequest.splice(recv.pendingRequest.indexOf(send.id), 1);
		}
	}

	/* 
	*/
	decline(send:User, recv:User){
		if (send.friendsRequest.includes(recv.id))
			send.friendsRequest.splice(send.friendsRequest.indexOf(recv.id), 1);
			recv.pendingRequest.splice(recv.pendingRequest.indexOf(send.id), 1);
	}
}
