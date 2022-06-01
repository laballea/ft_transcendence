export interface MessageEvent {
	data: string | object;
	id?: string;
	type?: string;
	retry?: number;
}

export interface friendEvent {
	id: number;
	friend_id: number;
}