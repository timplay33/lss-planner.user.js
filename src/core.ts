import type { Dictionary } from "./types/types";
import { openDatabase } from "./db";
import * as dictionaryImport from "./public/dictionary.json";
import { addLeitstellenToEditModal, addMenuEntry, logMessage } from "./lib";
import { SetEventListeners } from "./EventListeners";
import { setMarkers } from "./lib/map/marker";

export const dictionary: Dictionary = dictionaryImport;
export const db: IDBDatabase = await openDatabase();

async function main() {
	logMessage("Starting...");

	addLeitstellenToEditModal();

	addMenuEntry();
	SetEventListeners();

	setMarkers();
}
main();
