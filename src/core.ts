import type { Dictionary } from "./types/types";
import { getAllElements, openDatabase } from "./db";
import * as dictionaryImport from "./public/dictionary.json";
import { addModals, logMessage } from "./lib";

const dictionary: Dictionary = dictionaryImport;

async function main() {
	logMessage("Starting...");
	addModals();
	const db = await openDatabase();
	console.log(await getAllElements(db));
}
main();
