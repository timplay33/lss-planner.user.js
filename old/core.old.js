const lsspURL = window.lssp.lsspURL;
const scriptName = window.lssp.scriptName;

const notesMarker = {
	start: "LSS-Planner Backup START: Do not modify",
	end: "LSS-Planner Backup END",
};
var markers = {};
var icons = {};

// general functions

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
const alertMessage = (message) => {
	return `<div class="alert fade in alert-success "><button class="close" data-dismiss="alert" type="button">×</button>${message}</div>`;
};

function logMessage(message) {
	console.log(`[${scriptName}]: ` + message);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Modal Opening functions
function openInfo(building) {
	let modal = $(`#lssp-building-modal`);
	modal.modal("show");
	document
		.getElementById(`lssp-building-modal-form`)
		.setAttribute("data", JSON.stringify(building));
	let modal_title = document.getElementById("lssp-building-modal-body-title");
	modal_title.innerHTML = `${building.name}`;

	let modal_type = document.getElementById("lssp-building-modal-body-type");
	modal_type.innerHTML = `${dictionary[building.type].caption}`;

	let modal_lat = document.getElementById("lssp-building-modal-body-lat");
	modal_lat.innerHTML = `Latitude: ${building.lat}`;

	let modal_lng = document.getElementById("lssp-building-modal-body-lng");
	modal_lng.innerHTML = `Longitude: ${building.lng}`;

	let modal_leitstelle = document.getElementById(
		"lssp-building-modal-body-leitstelle"
	);
	$.getJSON("../api/buildings", function (data) {
		data = data.filter((l) => l.id == building.leitstelle);
		modal_leitstelle.innerHTML = `Leitstelle: ${data[0]?.caption || ""}`;
	});
}
function openEdit(building) {
	let modal = $(`#lssp-building-edit-modal`);
	modal.modal("show");
	document
		.getElementById(`lssp-building-edit-modal-form`)
		.setAttribute("data", JSON.stringify(building));

	let modal_title = document.getElementById(
		"lssp-building-modal-building-name"
	);
	modal_title.setAttribute("value", building.name);

	$("#lssp-building-modal-building-type").val(building.type);
	$("#lssp-building-modal-building-leitstelle").val(building.leitstelle);
}
async function onClick(e) {
	openInfo(await getElementById(window.lssp.db, parseInt(e.target._icon.id)));
}

// Map / UI functions
function setBuildingMarker(building) {
	icons[building.id] = L.icon({
		iconUrl: dictionary[building.type].icon,
		iconSize: [32, 37],
		iconAnchor: [16, 37],
	});
	markers[building.id] = L.marker([building.lat, building.lng], {
		title: building.name,
		opacity: 0.6,
		icon: icons[building.id],
	})
		.on("click", onClick)
		.addTo(map)
		.bindTooltip(building.name);
	markers[building.id]._icon.id = building.id;
}
function addButtons() {
	L.Control.MyControl = L.Control.extend({
		onAdd: function (map) {
			var el = L.DomUtil.create("div", "leaflet-bar my-control");

			el.innerHTML = `
                <button id="plan-new-building" class="btn btn-xs ajax btn-default" >Neues Gebäude planen</button>
                <button id="save-plan-new-building" class="btn btn-xs ajax btn-default" >Speichern</button>`;

			return el;
		},
	});

	L.control.myControl = function (opts) {
		return new L.Control.MyControl(opts);
	};

	L.control
		.myControl({
			position: "bottomleft",
		})
		.addTo(map);

	document
		.getElementById("plan-new-building")
		.addEventListener("click", addBuilding, false);
	document.getElementById("save-plan-new-building").disabled = true;
	("hidden");
}

function addMenuEntry() {
	/** Add divider  */
	let divider = document.createElement("li");
	divider.setAttribute("class", "divider");
	divider.setAttribute("role", "presentation");
	document
		.getElementById("logout_button")
		.parentElement.parentElement.appendChild(divider);

	/** Add button */
	let button = document.createElement("a");
	button.setAttribute("href", "javascript: void(0)");
	button.setAttribute("id", "lssp-button");
	button.append("Lss-Planner");
	let button_li = document.createElement("li");
	button_li.appendChild(button);
	document
		.getElementById("logout_button")
		.parentElement.parentElement.appendChild(button_li);
}

function addBuilding() {
	function saveBuilding() {
		$("#lssp-building-edit-modal").modal("show");
		let latlng = marker.getLatLng();
		document.getElementById(`lssp-building-edit-modal-form`).setAttribute(
			"data",
			JSON.stringify({
				lat: latlng.lat,
				lng: latlng.lng,
			})
		);

		let icon = L.icon({
			iconUrl: dictionary[type].icon,
			iconSize: [32, 37],
			iconAnchor: [16, 37],
		});
		marker.setIcon(icon);
	}

	let btn = document.getElementById("plan-new-building");
	let saveButton = document.getElementById("save-plan-new-building");

	btn.disabled = true;
	saveButton.disabled = false;

	document
		.getElementById("save-plan-new-building")
		.addEventListener("click", saveBuilding, false);

	logMessage("Adding building...");
	let center = map.getCenter();
	let marker = L.marker([center.lat, center.lng], {
		draggable: true,
		zIndexOffset: 100000,
	}).addTo(map);
}

async function buildBuilding(building) {
	let modal = $(`#lssp-building-modal`);
	modal.modal("hide");
	document.getElementById("build_new_building").click();
	await sleep(500);
	$("#building_building_type").val(building.type);
	$("#building_name").val(building.name);
	building_new_marker.setLatLng(L.latLng(building.lat, building.lng));
	building_new_dragend();
	$("#building_leitstelle_building_id").val(building.leitstelle);
	$("#new_building").on("submit", function () {
		logMessage("Build: " + building.name);
		deleteElementById(window.lssp.db, building.id);
	});
}

// Save to Notes Feature
var stringToHTML = function (str) {
	var dom = document.createElement("div");
	dom.innerHTML = str;
	return dom;
};
async function getNotes() {
	res = await $.get("https://www.leitstellenspiel.de/note");
	html = stringToHTML(res);
	return html.querySelector("textarea").innerHTML;
}
async function getToken() {
	res = await $.get("https://www.leitstellenspiel.de/note");
	html = stringToHTML(res);
	return html.querySelectorAll("input")[2].getAttribute("value");
}
function searchBackUpData(notes) {
	let start = notes.search(notesMarker.start);
	let end = notes.search(notesMarker.end);
	return notes.substring(start + notesMarker.start.length + 1, end);
}
async function saveToNotes(text, token) {
	let note = await getNotes();
	let start = note.search(notesMarker.start);
	let end = note.search(notesMarker.end);
	if (start != -1 || end != -1) {
		note = note.substring(0, start - 2);
	}
	let save = `${note}\n ${notesMarker.start}\n ${text}\n ${notesMarker.end}`;

	fetch("https://www.leitstellenspiel.de/note", {
		headers: {
			accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
			"cache-control": "max-age=0",
			"content-type": "application/x-www-form-urlencoded",
			"sec-ch-ua":
				'"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			"sec-fetch-dest": "iframe",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-origin",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
		},
		referrer: "https://www.leitstellenspiel.de/note",
		referrerPolicy: "strict-origin-when-cross-origin",
		body: `utf8=%E2%9C%93&_method=put&authenticity_token=${token}&note[message]=${save}&commit=Speichern`,
		method: "POST",
		mode: "cors",
		credentials: "include",
	});
}

// Download OBJECT as JSON
function downloadObjectAsJson(exportObj, exportName) {
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

// Main function
async function main() {
	await loadScript(lsspURL + "db.js").catch(function (error) {
		console.log(error);
	});

	logMessage("Starting...");
	const db = await openDatabase(); // Creates database if it doesn't exist
	window.lssp.db = db;

	await loadScript(lsspURL + "modals.js").catch(function (error) {
		console.log(error);
	});
	addModal();
	addBuildingModal();
	addBuildingEditModal();
	addButtons(); // Adds buttons to Map
	addMenuEntry(); // Adds Buttons to open main Modal

	////////////////////////////////////////////////////////////////

	// Open Main Modal
	$("#lssp-button").on("click", async function () {
		let modal = $(`#lssp-modal`);
		modal.modal("show");
		await getAllElements(window.lssp.db)
			.then((buildings) =>
				buildings.sort((a, b) => a.name.localeCompare(b.name))
			)
			.then((buildings) =>
				buildings.sort().forEach((b) => {
					$("#lssp-modal-dash-table-body").append(`
						<tr>
						<td>
							<img
								src="${dictionary[b.type].icon}"
								alt="icon ${dictionary[b.type].caption}"
							/>
						</td>
						<td><a id="lssp-modal-dash-table-body-link">${b.name}</a></td>
						<td>${dictionary[b.type].caption}</td>
					</tr>`);
					let Buttons = document.querySelectorAll(
						`#lssp-modal-dash-table-body-link`
					);
					let lastButton = Buttons[Buttons.length - 1];
					lastButton.addEventListener("click", () => {
						openInfo(b);
					});
				})
			);
	});

	// Download Building Data as Json
	$("#lssp-modal-export").on("click", async function () {
		downloadObjectAsJson(await getAllElements(window.lssp.db), "LSS-Planner");
	});

	// Export Building Data to Notes
	$("#lssp-modal-export-notes").on("click", async function () {
		if (confirm("Wirklich alles Löschen?")) {
			const json = await getAllElements(window.lssp.db);
			const note = JSON.stringify(json);
			const token = await getToken();
			saveToNotes(note, token);
			logMessage("in Notizen gespeichert: \n" + note);
		} else {
			logMessage("in Notizen speichern abgebrochen");
		}
	});

	// Delete all Buildings from database
	$("#lssp-modal-delete").on("click", async function () {
		if (confirm("Wirklich alles Löschen?")) {
			await getAllElements(window.lssp.db).then((b) => {
				b.forEach((a) => deleteElementById(window.lssp.db, a.id));
				logMessage("Alles Gelöscht");
			});
		} else {
			logMessage("Löschen Abgebrochen");
		}
	});

	// Adding Buildings to Map
	const buildings = await getAllElements(window.lssp.db);
	buildings.forEach((b) => {
		setBuildingMarker(b);
	});

	$(document).ready(function () {
		// Building Options
		$("#lssp-building-modal-form").submit(function (event) {
			event.preventDefault();
			let building = JSON.parse(event.target.getAttribute("data"));
			if (
				event.originalEvent.submitter ==
				document.getElementById("lssp-building-modal-form-delete")
			) {
				// Delete Building
				deleteElementById(window.lssp.db, building.id);
				location.reload();
			} else if (
				event.originalEvent.submitter ==
				document.getElementById("lssp-building-modal-form-build")
			) {
				// Open Building Build Options
				buildBuilding(building);
			} else {
				// Edit Building
				openEdit(building);
			}
		});
		// Edit Building
		$("#lssp-building-edit-modal-form").submit(function (event) {
			event.preventDefault();
			let building = JSON.parse(
				document
					.getElementById("lssp-building-edit-modal-form")
					.getAttribute("data")
			);
			const title = $("#lssp-building-edit-modal-form input:text").val();
			const type = $("#lssp-building-modal-building-type").val();
			const leitstelle = $("#lssp-building-modal-building-leitstelle").val();
			logMessage(`${title} - ${type}`);
			building.name = title;
			building.type = type;
			building.leitstelle = leitstelle;
			addData(window.lssp.db, building);
			location.reload();
		});
	});

	// Import From JSON to Database
	document.getElementById("lssp-modal-import").onclick = function () {
		var files = document.getElementById("lssp-modal-selectFiles").files;
		if (files.length <= 0) {
			return false;
		}

		var fr = new FileReader();

		fr.onload = function (e) {
			var result = JSON.parse(e.target.result);
			result.forEach((b) => {
				$("#lssp-modal-body-output").append(`
					<tr>
					<td ><img src="${dictionary[b.type].icon}" alt="icon ${
					dictionary[b.type].caption
				}"></td>
					<td >${b.name}</td>
					<td >${dictionary[b.type].caption}</td>
				</tr>`);
			});
			$("#lssp-modal-import-save").on("click", function () {
				result.forEach((b) => {
					addData(window.lssp.db, b);
					location.reload();
				});
			});
		};

		fr.readAsText(files.item(0));
	};

	// Import From Notes to Database
	$("#lssp-modal-import-notes").on("click", async function () {
		const notes = searchBackUpData(await getNotes());
		const json = JSON.parse(notes);
		json.forEach((b) => {
			$("#lssp-modal-body-output").append(`
				<tr>
				<td ><img src="${dictionary[b.type].icon}" alt="icon ${
				dictionary[b.type].caption
			}"></td>
				<td >${b.name}</td>
				<td >${dictionary[b.type].caption}</td>
			</tr>`);
		});
		$("#lssp-modal-import-save").on("click", function () {
			json.forEach((b) => {
				addData(window.lssp.db, b);
				location.reload();
			});
		});
	});
}

// Run the Program
main();
