import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";
import { dictionary } from "../../core";
import { LsspBuilding } from "../../types/types";

export class building {
	private _id: number;
	private _name: string;
	private _type: number;
	private _lat: number;
	private _lng: number;
	private _leitstelle: number;

	constructor(
		id: number = NaN,
		name: string = "",
		type: number = NaN,
		lat: number = NaN,
		lng: number = NaN,
		leitstelle: number = NaN
	) {
		this._id = id;
		this._name = name;
		this._type = type;
		this._lat = lat;
		this._lng = lng;
		this._leitstelle = leitstelle;
	}

	public set id(id: number) {
		if (typeof id !== "number") {
			throw new Error("id must be a number");
		}
		this._id = id;
	}
	public get id() {
		return this._id;
	}

	public set name(name: string) {
		if (typeof name !== "string") {
			throw new Error("name must be a string");
		}
		this._name = name;
	}
	public get name() {
		return this._name;
	}

	public set type(type: number) {
		if (typeof type !== "number") {
			throw new Error("type must be a number");
		}
		this._type = type;
	}
	public get type() {
		return this._type;
	}

	public set lat(lat: number) {
		if (typeof lat !== "number") {
			throw new Error("lat must be a number");
		}
		this._lat = lat;
	}
	public get lat() {
		return this._lat;
	}

	public set lng(lng: number) {
		if (typeof lng !== "number") {
			throw new Error("lng must be a number");
		}
		this._lng = lng;
	}
	public get lng() {
		return this._lng;
	}

	public set leitstelle(leitstelle: number) {
		if (typeof leitstelle !== "number") {
			throw new Error("leitstelle must be a number");
		}
		this._leitstelle = leitstelle;
	}
	public get leitstelle() {
		return this._leitstelle;
	}
	set(obj: LsspBuilding) {
		this._id = obj.id * 1;
		this._name = obj.name;
		this._type = obj.type * 1;
		this._lat = obj.lat;
		this._lng = obj.lng;
		if (obj.leitstelle) {
			this._leitstelle = obj.leitstelle * 1;
		}
	}
	public getWithoutID(): {
		name: string;
		type: number;
		lat: number;
		lng: number;
		leitstelle: number;
	} {
		return {
			name: this._name,
			type: this._type,
			lat: this._lat,
			lng: this._lng,
			leitstelle: this._leitstelle,
		};
	}

	public setLatLng(latlng: L.LatLng) {
		this._lat = latlng.lat;
		this._lng = latlng.lng;
	}

	public get leitstellenName() {
		return new Promise<string>((resolve, reject) => {
			$.getJSON("../api/buildings", (data: Building[]) => {
				const filteredData = data.filter((l) => l.id == this._leitstelle);
				const leitstellenName = filteredData[0]?.caption || "";
				resolve(leitstellenName);
			}).fail((jqXHR, textStatus, errorThrown) => {
				reject(errorThrown);
			});
		});
	}
	public get typeName() {
		if (this._type) {
			return dictionary[this._type].caption;
		}
		return "";
	}
	public get iconURL() {
		if (this._type) {
			return dictionary[this._type].icon;
		}
		return "";
	}

	public getAllProperties(): {
		id: number;
		name: string;
		type: number;
		lat: number;
		lng: number;
		leitstelle: number;
	} {
		return {
			id: this._id,
			name: this._name,
			type: this._type,
			lat: this._lat,
			lng: this._lng,
			leitstelle: this._leitstelle,
		};
	}
}
