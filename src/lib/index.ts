import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";
import { db } from "../core";
import { building } from "./classes/building";
import { deleteItemById } from "../db";

export function logMessage(...message: Array<any>): void {
	console.log(
		`[${sessionStorage.getItem("scriptName") || "LSS-Planner"}]: `,
		...message
	);
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function addMenuEntry() {
	/** Add divider  */
	let divider = document.createElement("li");
	divider.setAttribute("class", "divider");
	divider.setAttribute("role", "presentation");
	document
		.getElementById("logout_button")
		?.parentElement?.parentElement?.appendChild(divider);

	/** Add button */
	let button = document.createElement("a");
	button.setAttribute("href", "javascript: void(0)");
	button.setAttribute("id", "lssp-button");
	button.append("Lss-Planner");
	let button_li = document.createElement("li");
	button_li.appendChild(button);
	document
		.getElementById("logout_button")
		?.parentElement?.parentElement?.appendChild(button_li);
}

export function addLeitstellenToEditModal() {
	$.getJSON("../api/buildings", function (data) {
		data = data.filter((leitstelle: Building) => leitstelle.building_type == 7);
		data.forEach((leitstelle: Building) => {
			$("#lssp-building-modal-building-leitstelle").append(
				`<option value="${leitstelle.id}">${leitstelle.caption}</option>`
			);
		});
	});
}
declare const building_new_marker: any;
declare var L: any;
declare function building_new_dragend(): any;
export async function buildBuilding(b: building) {
	let modal = $(`#lssp-building-modal`);
	modal.modal("hide");
	document.getElementById("build_new_building")?.click();
	await sleep(500);
	$("#building_building_type").val(b.type).trigger("change");
	$("#building_name").val(b.name).trigger("keydown");
	building_new_marker.setLatLng(L.latLng(b.lat, b.lng));
	building_new_dragend();
	$("#building_leitstelle_building_id").val(b.leitstelle).trigger("change");
	$("#new_building").on("submit", function () {
		logMessage("Build: " + b.name);
		deleteItemById(db, b.id);
	});
}

export function downloadObjectAsJson(exportObj: object, exportName: string) {
	var dataStr =
		"data:text/json;charset=utf-8," +
		encodeURIComponent(JSON.stringify(exportObj));
	var downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

export function convertDate(date: Date): string {
	let now = new Date(date);
	let day = now
		.toLocaleDateString()
		.split(".")
		.map((x) => (x.length < 2 ? 0 + x : x))
		.join("-");

	let time = [now.getHours(), now.getMinutes()]
		.map((x) => (x.toString().length < 2 ? 0 + x.toString() : x.toString()))
		.join("-");
	return [day, time].join("-");
}
