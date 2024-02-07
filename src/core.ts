import type { Dictionary } from "./types/types";
import { getAllElements, openDatabase } from "./db";
import * as dictionaryImport from "./public/dictionary.json";
import { addLeitstellenToEditModal, addMenuEntry, logMessage } from "./lib";
import * as modals from "./modals";
import { SetEventListeners } from "./EventListeners";
import { setBuildingMarker } from "./lib/map";

export const dictionary: Dictionary = dictionaryImport;
export const db: IDBDatabase = await openDatabase();

async function main() {
	logMessage("Starting...");
	console.log(modals);

	addLeitstellenToEditModal();

	addMenuEntry();
	SetEventListeners();

	getAllElements(db).then((buildings) =>
		buildings.forEach((building) => setBuildingMarker(building))
	);
}
main();
