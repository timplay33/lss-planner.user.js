import { Database } from "./db";
import {
	addLeitstellenToEditModal,
	addMenuEntry,
	logMessage,
} from "./lib";
import { initModals } from "./modals";
import { SetEventListeners } from "./EventListeners";
import { setMarkers } from "./lib/map/marker";
import { addButtonsToMap } from "./lib/map/buttons";

async function main() {
	// StatUp
	logMessage("Starting...");

	// Init DB
	await Database.init();
	logMessage("Database initialized.");

	// UI
	addLeitstellenToEditModal();
	initModals();
	addMenuEntry();
	SetEventListeners();

	// Map
	setMarkers();
	addButtonsToMap();
}
main();
