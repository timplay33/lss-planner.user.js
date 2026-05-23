export interface LsspBuilding {
	id: number;
	name: string;
	type: number;
	lat: number;
	lng: number;
	leitstelle?: number;
}

export type LsspBuildingNoID = Omit<LsspBuilding, "id">;

export interface DictionaryEntry {
	readonly icon: string;
	readonly caption: string;
}

export type DictionaryMap = Readonly<Record<number, DictionaryEntry>>;

export type BuildingTypeOption = Readonly<{
	key: number;
	caption: string;
}>;

export type Icons = Readonly<Record<number, L.Icon>>;

export type Markers = Readonly<Record<number, L.Marker>>;
