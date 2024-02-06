export interface Building {
	id: number;
	name: string;
	type: number;
	lat: number;
	lng: number;
}

export interface Dictionary {
	[key: number]: {
		icon: string;
		caption: string;
	};
}
