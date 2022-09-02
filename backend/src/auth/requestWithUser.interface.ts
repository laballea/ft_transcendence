import { Request } from 'express';
import { User } from '../user/models/user.entity';

interface RequestWithUser extends Request {
	user: User;
}

export default RequestWithUser;