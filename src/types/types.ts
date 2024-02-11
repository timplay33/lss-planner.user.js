export interface LsspBuilding {
	id: number;
	name: string;
	type: number;
	lat: number;
	lng: number;
	leitstelle?: number;
}

export type LsspBuildingNoID = Omit<LsspBuilding, "id">;

export interface Dictionary {
	[key: number]: {
		icon: string;
		caption: string;
	};
}

export type Icons = {
	[key: number]: L.Icon;
};

export type Markers = {
	[key: number]: L.Marker;
};
