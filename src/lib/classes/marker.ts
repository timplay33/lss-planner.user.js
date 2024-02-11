import { Modal_Building } from "../../modals";
import { getElementById } from "../../db";
import { db } from "../../core";
import { building } from "./building";

declare const map: L.Map;
declare var L: any;

export class CustomMarker {
	lat: number;
	lng: number;
	name: string;
	buildingId: number;
	iconUrl: string;
	marker: L.Marker;

	constructor(building: building, iconUrl: string) {
		this.lat = building.lat;
		this.lng = building.lng;
		this.name = building.name;
		this.iconUrl = iconUrl || "/images/building_fire_other.png";
		this.marker = this.createMarker();
		this.buildingId = building.id;
	}

	private createMarker(): L.Marker {
		const customIcon = L.icon({
			iconUrl: this.iconUrl,
			iconSize: [32, 37], // Adjust size as needed
			iconAnchor: [16, 37], // Adjust anchor point as needed
		});

		return L.marker([this.lat, this.lng], {
			icon: customIcon,
			opacity: 0.6,
		})
			.bindTooltip(this.name)
			.on("click", async () => {
				Modal_Building.openWithData(await getElementById(db, this.buildingId));
			});
	}
	public get LatLng() {
		return [this.lat, this.lng];
	}
	public addToMap(): void {
		this.marker.addTo(map);
	}

	public removeFromMap(): void {
		map.removeLayer(this.marker);
	}
}
