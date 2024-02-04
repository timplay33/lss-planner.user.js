const lsspURL = window.lssp.lsspURL;
const scriptName = window.lssp.scriptName;

////////////////////////////////////////////////////////////////
function loadScript(src) {
	return new Promise(function (resolve, reject) {
		var scriptElement = document.createElement("script");
		scriptElement.src = src;
		document.head.appendChild(scriptElement);
		scriptElement.onload = function () {
			resolve("Script loaded successfully");
		};

		scriptElement.onerror = function () {
			reject(new Error("Failed to load script"));
		};
	});
}

async function logMessage(message) {
	console.log(`[${scriptName}]: ` + message);
}
window.lssp.logMessage = logMessage;

////////////////////////////////////////////////////////////////
async function addUiElements(buildings) {
	await loadScript(lsspURL + "ui_elements.js").catch(function (error) {
		console.log(error);
	});
	UiElementsMain(buildings);
}
////////////////////////////////////////////////////////////////
async function addMapElements(buildings) {
	await loadScript(lsspURL + "map.js").catch(function (error) {
		console.log(error);
	});
	buildings.forEach((building) => {
		setBuildingMarker(building);
	});
}
////////////////////////////////////////////////////////////////
async function main() {
	await loadScript(lsspURL + "db.js").catch(function (error) {
		console.log(error);
	});

	logMessage("Starting...");
	var db = await openDatabase();
	window.lssp.db = db;

	const buildings = await getAllElements(db);
	window.lssp.buildings = buildings;
	addMapElements(buildings);
	addUiElements(buildings);
}
main();
