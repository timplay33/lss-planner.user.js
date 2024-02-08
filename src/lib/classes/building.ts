import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";
import { dictionary } from "../../core";
import { LsspBuilding } from "../../types/types";

export class building {
	id: number | undefined;
	name: string | undefined;
	type: number | undefined;
	lat: number;
	lng: number;
	leitstelle: number | undefined;
	constructor(
		id: number = NaN,
		name: string = "",
		type: number = NaN,
		lat: number = NaN,
		lng: number = NaN,
		leitstelle: number = NaN
	) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.lat = lat;
		this.lng = lng;
		this.leitstelle = leitstelle;
	}
	set(obj: LsspBuilding) {
		this.id = obj.id;
		this.name = obj.name;
		this.type = obj.type;
		this.lat = obj.lat;
		this.lng = obj.lng;
		this.leitstelle = obj.leitstelle;
	}
	setLatLng(latlng: L.LatLng) {
		this.lat = latlng.lat;
		this.lng = latlng.lng;
	}
	get() {
		return {
			id: this.id as number,
			name: this.name as string,
			type: this.type as number,
			lat: this.lat,
			lng: this.lng,
			leitstelle: this.leitstelle as number,
		};
	}
	getLeitstelle() {
		$.getJSON("../api/buildings", (data: Building[]) => {
			data = data.filter((l) => l.id == this.leitstelle);
			return data[0]?.caption || "";
		});
	}
	getTypeName() {
		if (this.type) {
			return dictionary[this.type].caption;
		}
		return "";
	}
	getIconURL() {
		if (this.type) {
			return dictionary[this.type].icon;
		}
		return "";
	}
}
