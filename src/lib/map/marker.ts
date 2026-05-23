import { Database } from "../../db";
import { CustomMarker } from "../classes/marker";

export async function setMarkers() {
	var markers: CustomMarker[] = [];
	const db = Database.getInstance();
	const buildings = await db.getAllElements();
	buildings.forEach((building) => {
		let m = new CustomMarker(building, building.iconURL);
		m.addToMap();
		markers.push(m);
	});
	return markers;
}
