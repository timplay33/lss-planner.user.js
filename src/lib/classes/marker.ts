import { Modal_Building } from "../../modals";
import { Database } from "../../db";
import { building } from "./building";
import { AppDictionary, IconVariant } from "../../dictionary";

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
		this.iconUrl = iconUrl || AppDictionary.getIcon(0, IconVariant.MAP);
		this.marker = this.createMarker();
		this.buildingId = building.id;
		this.buildingType = building.type;
	}

	private createMarker(): L.Marker {
		const db = Database.getInstance();
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
				Modal_Building.openWithData(await db.getElementById(this.buildingId));
			});
	}
	public get LatLng() {
		return [this.lat, this.lng];
	}

	public addToMap(): void {
		this.getMarkerGroup().addLayer(this.marker);

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

	private getMarkerGroup(): L.LayerGroup {
		switch (AppDictionary.getCategory(this.buildingType)) {
			case "Feuerwehr":
				return feuerwehrMarkerGroup;
			case "Polizei":
				return polizeiMarkerGroup;
			case "Rettungsdienst":
			case "Spezialrettung":
				return rettungsMarkerGroup;
			case "Schulen":
				return schulenMarkerGroup;
			case "THW":
				return thwMarkerGroup;
			default:
				return otherMarkerGroup;
		}
	}

	public removeFromMap(): void {
		map.removeLayer(this.marker);
	}
}
