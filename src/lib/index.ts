import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";
import { Database } from "../db";
import { building } from "./classes/building";
import MenuEntryTemplate from "../modals/templates/menu-entry.hbs";

type SelectOption = {
	key: number;
	caption: string;
};

let leitstellenOptions: SelectOption[] = [];

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
	const logout = document.getElementById("logout_button");
	const parent = logout?.parentElement?.parentElement;
	if (!parent) return;
	parent.insertAdjacentHTML("beforeend", MenuEntryTemplate({ label: "Lss-Planner" }));
}

export async function addLeitstellenToEditModal() {
	const data = await $.getJSON("../api/buildings");
	leitstellenOptions = (data as Array<Building>)
		.filter((leitstelle: Building) => leitstelle.building_type == 7)
		.map((leitstelle: Building) => ({
			key: leitstelle.id,
			caption: leitstelle.caption,
		}));
}

export function getLeitstellenOptions(): SelectOption[] {
	return leitstellenOptions;
}

declare var L: any;

function getPageValue<T>(key: string): T | undefined {
	return (window as unknown as Record<string, T | undefined>)[key];
}

async function waitForElement(selector: string, timeoutMs = 3000): Promise<Element | null> {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		const element = document.querySelector(selector);
		if (element) return element;
		await sleep(100);
	}
	return null;
}

function setInputValue(selector: string, value: number): boolean {
	const input = document.querySelector<HTMLInputElement>(selector);
	if (!input) return false;
	input.value = String(value);
	input.dispatchEvent(new Event("input", { bubbles: true }));
	input.dispatchEvent(new Event("change", { bubbles: true }));
	return true;
}

function setBuildingCoordinates(b: building): void {
	const marker = getPageValue<{ setLatLng: (latLng: L.LatLng) => void }>(
		"building_new_marker"
	);
	const dragend = getPageValue<() => void>("building_new_dragend");

	if (marker) {
		marker.setLatLng(L.latLng(b.lat, b.lng));
		dragend?.();
		return;
	}

	const latitudeSet = setInputValue("#building_latitude", b.lat)
		|| setInputValue('input[name="building[latitude]"]', b.lat);
	const longitudeSet = setInputValue("#building_longitude", b.lng)
		|| setInputValue('input[name="building[longitude]"]', b.lng);

	if (!latitudeSet || !longitudeSet) {
		throw new Error("Could not set building coordinates on the build form.");
	}
}

export async function buildBuilding(b: building) {
	const db = Database.getInstance();
	$(`#lssp-building-modal`).modal("hide");
	$(`#lssp-modal`).modal("hide");
	document.getElementById("build_new_building")?.click();
	await waitForElement("#new_building");
	$("#building_building_type").val(b.type).trigger("change");
	$("#building_name").val(b.name).trigger("keydown");
	setBuildingCoordinates(b);
	$("#building_leitstelle_building_id").val(b.leitstelle).trigger("change");
	$("#new_building").on("submit", function () {
		logMessage("Build: " + b.name);
		db.deleteItemById(b.id);
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
