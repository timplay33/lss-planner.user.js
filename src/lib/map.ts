import * as L from "leaflet";
import { Icons, LsspBuilding, Markers } from "../types/types";
import { dictionary } from "../core";
import { Modal_Building } from "../modals";
var icons: Icons = {};
var markers: Markers = {};
declare const map: L.Map;

export function setBuildingMarker(building: LsspBuilding) {
	icons[building.id] = L.icon({
		iconUrl: dictionary[building.type].icon,
		iconSize: [32, 37],
		iconAnchor: [16, 37],
	});

	markers[building.id] = L.marker([building.lat, building.lng], {
		title: building.name,
		opacity: 0.6,
		icon: icons[building.id],
	})
		.on("click", () => {
			Modal_Building.openWithData(building);
		})
		.addTo(map)
		.bindTooltip(building.name);
}
