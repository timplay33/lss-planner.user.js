import { db } from "../../core";
import { getAllElements } from "../../db";
import { Marker } from "../classes/marker";

export async function setMarkers() {
	var markers: Marker[] = [];
	const buildings = await getAllElements(db);
	buildings.forEach((building) => markers.push(new Marker(building)));
	return markers;
}
