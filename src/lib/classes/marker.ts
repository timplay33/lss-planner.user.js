import { Modal_Building } from "../../modals";
import { getElementById } from "../../db";
import { db } from "../../core";
import { building } from "./building";

export var feuerwehrMarkerGroup = L.layerGroup().addTo(map),
	polizeiMarkerGroup = L.layerGroup().addTo(map),
	rettungsMarkerGroup = L.layerGroup().addTo(map),
	schulenMarkerGroup = L.layerGroup().addTo(map),
	otherMarkerGroup = L.layerGroup().addTo(map),
	thwMarkerGroup = L.layerGroup().addTo(map);

declare const map: L.Map;
declare var L: any;

export class CustomMarker {
	lat: number;
	lng: number;
	name: string;
	buildingId: number;
	iconUrl: string;
	marker: L.Marker;
	buildingType: number;

	constructor(building: building, iconUrl: string) {
		this.lat = building.lat;
		this.lng = building.lng;
		this.name = building.name;
		this.iconUrl = iconUrl || "/images/building_fire_other.png";
		this.marker = this.createMarker();
		this.buildingId = building.id;
		this.buildingType = building.type;
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
		switch (this.buildingType) {
			case 0:
			case 18:
				feuerwehrMarkerGroup.addLayer(this.marker);
				break;
			case 2:
			case 20:
				rettungsMarkerGroup.addLayer(this.marker);
				break;
			case 6:
			case 19:
				polizeiMarkerGroup.addLayer(this.marker);
				break;
			case 3:
			case 1:
			case 8:
			case 10:
				schulenMarkerGroup.addLayer(this.marker);
				break;

			case 9:
				thwMarkerGroup.addLayer(this.marker);
				break;
			default:
				otherMarkerGroup.addLayer(this.marker);
				break;
		}
		if (sessionStorage.getItem("isRdHidden") == "true") {
			map.removeLayer(rettungsMarkerGroup);
		}
		if (sessionStorage.getItem("isFeuHidden") == "true") {
			map.removeLayer(feuerwehrMarkerGroup);
		}
		if (sessionStorage.getItem("isPolHidden") == "true") {
			map.removeLayer(polizeiMarkerGroup);
		}
		if (sessionStorage.getItem("isThwHidden") == "true") {
			map.removeLayer(thwMarkerGroup);
		}
		if (sessionStorage.getItem("isSchoolHidden") == "true") {
			map.removeLayer(schulenMarkerGroup);
		}
		if (sessionStorage.getItem("isOtherHidden") == "true") {
			map.removeLayer(otherMarkerGroup);
		}
	}

	public removeFromMap(): void {
		map.removeLayer(this.marker);
	}
}
