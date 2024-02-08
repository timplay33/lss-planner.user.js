import { Modal_Building } from "../../modals";
import { getElementById } from "../../db";
import { db, dictionary } from "../../core";
import { LsspBuilding } from "../../types/types";
declare const map: L.Map;
declare var L: any;
export class Marker {
	lat: number;
	lng: number;
	building_ID: number;
	name: string;
	icon: L.Icon;
	marker: L.Marker;
	constructor(building: LsspBuilding) {
		this.building_ID = building.id;
		this.lat = building.lat;
		this.lng = building.lng;
		this.name = building.name;
		this.marker = this.setMarker();
		this.icon = this.setIcon(dictionary[building.type].icon);
	}
	getLatLng() {
		return [this.lat, this.lng];
	}
	setMarker() {
		this.marker = L.marker([this.lat, this.lng], {
			title: this.name,
			opacity: 0.6,
		})
			.on("click", async () => {
				Modal_Building.openWithData(await getElementById(db, this.building_ID));
			})
			.addTo(map)
			.bindTooltip(this.name);
		return this.marker;
	}
	setIcon(iconUrl: string) {
		this.icon = L.icon({
			iconUrl: iconUrl,
			iconSize: [32, 37],
			iconAnchor: [16, 37],
		});
		this.marker.setIcon(this.icon);
		return this.icon;
	}
}
