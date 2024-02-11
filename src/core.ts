import type { Dictionary } from "./types/types";
import { getAllElements, openDatabase } from "./db";
import * as dictionaryImport from "./public/dictionary.json";
import {
	addLeitstellenToEditModal,
	addMenuEntry,
	compressJSON,
	getNotes,
	getToken,
	logMessage,
	saveToNotes,
} from "./lib";
import { SetEventListeners } from "./EventListeners";
import { setMarkers } from "./lib/map/marker";
import { addButtonsToMap } from "./lib/map/buttons";

export const dictionary: Dictionary = dictionaryImport;
export const db: IDBDatabase = await openDatabase();

async function main() {
	// StatUp
	logMessage("Starting...");

	// UI
	addLeitstellenToEditModal();
	addMenuEntry();
	SetEventListeners();

	// Map
	setMarkers();
	addButtonsToMap();

	console.log(JSON.stringify(compressJSON(await getAllElements(db))));
	//console.log(
	//	await saveToNotes(
	//		JSON.stringify(compressJSON(await getAllElements(db))),
	//		(await getToken()) as string
	//	)
	//);
}
main();
