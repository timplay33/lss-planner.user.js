import { db } from "../../core";
import { getAllElements } from "../../db";
import { CustomMarker } from "../classes/marker";

export async function setMarkers() {
	var markers: CustomMarker[] = [];
	const buildings = await getAllElements(db);
	buildings.forEach((building) => {
		let m = new CustomMarker(building, building.iconURL);
		m.addToMap();
		markers.push(m);
	});
	return markers;
}
