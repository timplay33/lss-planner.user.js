import { Modal_Building } from "../../modals";
import { Database } from "../../db";
import { building } from "./building";
import { AppDictionary, IconVariant } from "../../dictionary";

declare const map: L.Map;
declare var L: any;

const markerGroups = new Map<string, L.LayerGroup>();

export function getCategoryStorageKey(category: string): string {
	return `lssp-hidden-category:${encodeURIComponent(category)}`;
}

export function isCategoryHidden(category: string): boolean {
	return sessionStorage.getItem(getCategoryStorageKey(category)) === "true";
}

export function getMarkerGroup(category: string): L.LayerGroup {
	const existingMarkerGroup = markerGroups.get(category);
	if (existingMarkerGroup) {
		return existingMarkerGroup;
	}

	const markerGroup = L.layerGroup();
	markerGroups.set(category, markerGroup);
	if (!isCategoryHidden(category)) {
		markerGroup.addTo(map);
	}

	return markerGroup;
}

export function setCategoryVisibility(category: string, isVisible: boolean): void {
	const markerGroup = getMarkerGroup(category);
	sessionStorage.setItem(getCategoryStorageKey(category), String(!isVisible));
	if (isVisible) {
		map.addLayer(markerGroup);
		return;
	}
	map.removeLayer(markerGroup);
}

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
		getMarkerGroup(AppDictionary.getCategory(this.buildingType)).addLayer(
			this.marker
		);
	}

	public removeFromMap(): void {
		map.removeLayer(this.marker);
	}
}
