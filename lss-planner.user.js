// ==UserScript==
// @name         LSS-Planner
// @namespace    https://heidler.eu.org/
// @version      0.3.0
// @description  LSS-Planner
// @author       Tim Heidler git:@timplay33
// @match        https://www.leitstellenspiel.de/
// @icon         https://www.leitstellenspiel.de/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
	("use strict");

	// Variables

	const dbName = "LSS-Planner";
	const scriptName = "LSS-Planner";
	var markers = {};
	var icons = {};
	const dictionary = {
		0: {
			icon: "/images/building_fire_other.png",
			caption: "Feuerwache",
		},
		1: {
			icon: "/images/building_fireschool_other.png",
			caption: "Feuerwehrschule",
		},
		2: {
			icon: "/images/building_rescue_station_other.png",
			caption: "Rettungswache",
		},
		3: {
			icon: "/images/building_rettungsschule_other.png",
			caption: "Rettungsschule",
		},
		4: {
			icon: "/images/building_hospital_other.png",
			caption: "Krankenhaus",
		},
		5: {
			icon: "/images/building_helipad_other.png",
			caption: "Rettungshubschrauber-Station",
		},
		6: {
			icon: "/images/building_polizeiwache_other.png",
			caption: "Polizeiwache",
		},
		7: {
			icon: "/images/building_leitstelle_other.png",
			caption: "Leitstelle",
		},
		8: {
			icon: "/images/building_polizeischule_other.png",
			caption: "Polizeischule",
		},
		9: {
			icon: "/images/building_thw_other.png",
			caption: "THW",
		},
		10: {
			icon: "/images/building_thw_school_other.png",
			caption: "THW Bundesschule",
		},
		11: {
			icon: "/images/building_bereitschaftspolizei_other.png",
			caption: "Bereitschaftspolizei",
		},
		12: {
			icon: "/images/building_seg_other.png",
			caption: "Schnelleinsatzgruppe (SEG)",
		},
		13: {
			icon: "/images/building_helipad_polizei_other.png",
			caption: "Polizeihubschrauberstation",
		},
		14: {
			icon: "/images/building_bereitstellungsraum_other.png",
			caption: "Bereitstellungsraum",
		},
		15: {
			icon: "/images/building_wasserwacht_other.png",
			caption: "Wasserrettung",
		},
		16: {
			icon: "/images/building_polizeiwache_other.png",
			caption: "Verbandszellen",
		},
		17: {
			icon: "/images/building_polizeisondereinheiten_other.png",
			caption: "Polizei-Sondereinheiten",
		},
		18: {
			icon: "/images/building_fire_other.png",
			caption: "Feuerwache (Kleinwache)",
		},
		19: {
			icon: "/images/building_polizeiwache_other.png",
			caption: "Polizeiwache (Kleinwache)",
		},
		20: {
			icon: "/images/building_rescue_station_other.png",
			caption: "Rettungswache (Kleinwache)",
		},
		21: {
			icon: "/images/building_rescue_station_other.png",
			caption: "Rettungshundestaffel",
		},
		22: {
			icon: "/images/building_complex_other.png",
			caption: "Großer Komplex",
		},
		23: {
			icon: "/images/building_complex_other.png",
			caption: "Kleiner Komplex",
		},
		24: {
			icon: "/images/building_police_horse_other.png",
			caption: "Reiterstaffel",
		},
	};
	// general functions
	const alertMessage = (message) => {
		return `<div class="alert fade in alert-success "><button class="close" data-dismiss="alert" type="button">×</button>${message}</div>`;
	};

	function logMessage(message) {
		console.log(`[${scriptName}]: ` + message);
	}

	// database functions
	function createDB() {
		const request = indexedDB.open(dbName, 3);
		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			if (!db.objectStoreNames.contains("buildings")) {
				const objStore = db.createObjectStore("buildings", {
					autoIncrement: true,
					keyPath: "id",
				});
				objStore.createIndex("id", "id", { unique: true });
				objStore.createIndex("name", "name", { unique: false });
				objStore.createIndex("type", "type", { unique: false });
				logMessage(`Created DB: ${dbName}`);
			}
		};
		request.onsuccess = (event) => {
			const db = event.target.result;
			db.close();
		};
	}

	function addToDB(building) {
		const request = indexedDB.open(dbName, 3);
		request.onsuccess = (event) => {
			const db = event.target.result;

			let transaction = db.transaction("buildings", "readwrite");
			let buildings = transaction.objectStore("buildings");

			buildings.put(building);
			logMessage(`Added: "${building?.name}"`);

			db.close();
		};
	}

	function deleteFromDB(id) {
		const request = indexedDB.open(dbName, 3);
		request.onsuccess = (event) => {
			const db = event.target.result;

			let transaction = db.transaction("buildings", "readwrite");
			let buildings = transaction.objectStore("buildings");

			let req = buildings.delete(id);
			req.onerror = (event) => {
				logMessage(`Deleted: "${id}", error: "${req.error.name}"`);
			};
			req.onsuccess = (event) => {
				logMessage(`Deleted: "${id}"`);
			};
			db.close();
		};
	}

	function getAllFromDB() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, 3);
			request.onsuccess = (event) => {
				const db = event.target.result;

				let transaction = db.transaction("buildings", "readwrite");
				let buildings = transaction.objectStore("buildings");

				let req = buildings.getAll();

				req.onsuccess = (event) => {
					resolve(req.result);
				};

				req.onerror = (event) => {
					reject(logIndex + `Error: "${req.error.name}"`);
				};
			};
			request.onerror = (event) => {
				reject(logIndex + `Error: "${request.error.name}"`);
			};
		});
	}

	function getFromDB(key) {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, 3);
			request.onsuccess = (event) => {
				const db = event.target.result;

				let transaction = db.transaction("buildings", "readwrite");
				let buildings = transaction.objectStore("buildings");

				let req = buildings.get(key);

				req.onsuccess = (event) => {
					resolve(req.result);
				};

				req.onerror = (event) => {
					reject(logIndex + `Error: "${req.error.name}"`);
				};
			};
			request.onerror = (event) => {
				reject(logIndex + `Error: "${request.error.name}"`);
			};
		});
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

		let modal_type = document.getElementById(
			"lssp-building-modal-building-type"
		);
		document
			.querySelector(`[value="${building.type}"]`)
			.setAttribute("selected", "selected");
		modal_type.setAttribute("value", building.type);
	}
	async function onClick(e) {
		openInfo(await getFromDB(parseInt(e.target._icon.id)));
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
		let savebtn = document.getElementById("save-plan-new-building");

		btn.disabled = true;
		savebtn.disabled = false;

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

	// Modal creation functions
	function addBuildingModal() {
		const modal = document.createElement("div");
		modal.className = "modal fade";
		modal.id = `lssp-building-modal`;
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-labelledby", "lssp-building-modal-label");
		modal.setAttribute("aria-hidden", "true");
		modal.style.zIndex = "5000";
		modal.innerHTML = `
		<div
		class="modal-dialog modal-lg"
		role="document"
		style="width: 95%; margin: 40px auto"
	>
		<div class="modal-content" action="">
			<div class="modal-header">
				<h1 class="modal-title" id="lssp-building-modal-label">LSS-Planner</h1>
				<button
					type="button"
					class="close"
					data-dismiss="modal"
					aria-label="Close"
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form id="lssp-building-modal-form">
				<div
					id="lssp-building-modal-body"
					class="modal-body"
					style="height: calc(100vh - 350px); overflow-y: auto"
				>
					<div>
						<h1 id="lssp-building-modal-body-title"></h1>
						<span id="lssp-building-modal-body-type"></span>
					</div>
					<p id="lssp-building-modal-body-lat">Latitude:</p>
					<p id="lssp-building-modal-body-lng">Longitude:</p>
					<button type="submit" id="lssp-building-modal-form-submit" class="btn btn-default">Bearbeiten</button>
					<button type="submit" id="lssp-building-modal-form-delete" data-confirm="Wirklich Löschen?" data-method="delete" class="btn btn-danger">Löschen</button>
				</div>
			</form>
		</div>
	</div>
	
		`;
		document.body.appendChild(modal);
	}

	function addBuildingEditModal() {
		const modal = document.createElement("div");
		modal.className = "modal fade";
		modal.id = `lssp-building-edit-modal`;
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-labelledby", "lssp-building-edit-modal-label");
		modal.setAttribute("aria-hidden", "true");
		modal.style.zIndex = "5000";
		modal.innerHTML = `
		<div
	class="modal-dialog modal-lg"
	role="document"
	style="width: 95%; margin: 40px auto"
>
	<div class="modal-content" action="">
		<div class="modal-header">
			<h1 class="modal-title" id="lssp-building-edit-modal-label">LSS-Planner</h1>
			<button
				type="button"
				class="close"
				data-dismiss="modal"
				aria-label="Close"
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<form id="lssp-building-edit-modal-form">
			<div
				id="lssp-building-edit-modal-body"
				class="modal-body"
				style="height: calc(100vh - 350px); overflow-y: auto"
			>
				<div class="col-md-12 col-xs-12">
					<div id="building_name_step">
						<div class="input-group string required building_name">
							<div class="input-group-addon">
								<label class="string required" for="building_name"
									><abbr title="required">*</abbr> Name</label
								>
							</div>
							<input
								class="string required form-control"
								id="lssp-building-modal-building-name"
								maxlength="40"
								name="building[name]"
								size="50"
								type="text"
								control-id="ControlID-14"
							/>
						</div>
					</div>
					<div class="input-group select required building_building_type">
						<div class="input-group-addon">
							<label
								class="integer required select required"
								for="lssp-building-modal-building-type"
								><abbr title="required">*</abbr> Gebäudetyp</label
							>
						</div>

						<select
							class="select required form-control"
							id="lssp-building-modal-building-type"
							name="building[building_type]"
						>
							<option value=""></option>
							<option value="7">Leitstelle</option>
							<option value="0">Feuerwache</option>
							<option value="18">Feuerwache (Kleinwache)</option>
							<option value="1">Feuerwehrschule</option>
							<option value="2">Rettungswache</option>
							<option value="20">Rettungswache (Kleinwache)</option>
							<option value="3">Rettungsschule</option>
							<option value="4">Krankenhaus</option>
							<option value="5">Rettungshubschrauber-Station</option>
							<option value="12">Schnelleinsatzgruppe (SEG)</option>
							<option value="6">Polizeiwache</option>
							<option value="19">Polizeiwache (Kleinwache)</option>
							<option value="11">Bereitschaftspolizei</option>
							<option value="17">Polizei-Sondereinheiten</option>
							<option value="24">Reiterstaffel</option>
							<option value="13">Polizeihubschrauberstation</option>
							<option value="8">Polizeischule</option>
							<option value="9">THW</option>
							<option value="10">THW Bundesschule</option>
							<option value="14">Bereitstellungsraum</option>
							<option value="15">Wasserrettung</option>
							<option value="21">Rettungshundestaffel</option>
						</select>
					</div>
				</div>
				<button
					type="submit"
					id="lssp-building-edit-modal-form-submit"
					class="btn btn-default"
				>
					Speichern
				</button>
			</div>
		</form>
	</div>
</div>


		`;
		document.body.appendChild(modal);
	}
	function addModal() {
		const modal = document.createElement("div");
		modal.className = "modal fade";
		modal.id = `lssp-modal`;
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-labelledby", "lssp-modal-label");
		modal.setAttribute("aria-hidden", "true");
		modal.style.zIndex = "5000";
		modal.innerHTML = `
		<div
	class="modal-dialog modal-lg"
	role="document"
	style="width: 95%; margin: 40px auto"
>
	<div class="modal-content" action="">
		<div class="modal-header">
			<h1 class="modal-title" id="lssp-modal-label">LSS-Planner</h1>
			<button
				type="button"
				class="close"
				data-dismiss="modal"
				aria-label="Close"
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<div
			id="lssp-modal-body"
			class="modal-body"
			style="height: calc(100vh - 350px); overflow-y: auto"
		>
		<div>
		<ul class="nav nav-tabs" role="tablist" style="margin-bottom: 10px">
			<li role="presentation" class="active">
				<a
					href="#lssp-modal-dash-panel"
					aria-controls="lssp-modal-dash-panel"
					role="tab"
					data-toggle="tab"
				>
					Übersicht
				</a>
			</li>
			<li role="presentation">
				<a
					href="#lssp-modal-backup-panel"
					aria-controls="lssp-modal-backup-panel"
					role="tab"
					data-toggle="tab"
				>
					BackUp
				</a>
			</li>
		</ul>
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane active" id="lssp-modal-dash-panel">
				<table
					id="lssp-modal-dash-table"
					class="table table-striped tablesorter tablesorter-default"
					role="grid"
				>
					<thead>
						<tr class="tablesorter-headerRow" role="row">
							<th></th>
							<th>Name</th>
							<th>Typ</th>
						</tr>
					</thead>
					<tbody
						id="lssp-modal-dash-table-body"
						aria-live="polite"
						aria-relevant="all"
					></tbody>
				</table>
			</div>
			<div role="tabpanel" class="tab-pane" id="lssp-modal-backup-panel">
				<input type="file" id="lssp-modal-selectFiles" value="Import" /><br />
				<button id="lssp-modal-import" class="btn btn-default">
					Importieren
				</button>
				<button id="lssp-modal-export" class="btn btn-success">
					Herunterladen
				</button>
				<table class="table table-striped tablesorter tablesorter-default">
					<thead>
						<tr class="tablesorter-headerRow" role="row">
							<th></th>
							<th>Name</th>
							<th>Typ</th>
						</tr>
					</thead>
					<tbody id="lssp-modal-body-output"></tbody>
				</table>
			</div>
		</div>
	</div>
	
		</div>
	</div>
</div>
		`;
		document.body.appendChild(modal);
	}

	async function main() {
		logMessage("Starting...");
		createDB();
		addModal();
		addBuildingModal();
		addBuildingEditModal();
		addButtons();
		addMenuEntry();

		$("#lssp-button").on("click", async function () {
			let modal = $(`#lssp-modal`);
			modal.modal("show");
			await getAllFromDB()
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
						let btns = document.querySelectorAll(
							`#lssp-modal-dash-table-body-link`
						);
						let lastbtn = btns[btns.length - 1];
						lastbtn.addEventListener("click", () => {
							openInfo(b);
						});
					})
				);
		});

		$("#lssp-modal-export").on("click", async function () {
			downloadObjectAsJson(await getAllFromDB(), "LSS-Planner");
		});

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

		await getAllFromDB().then((buildings) =>
			buildings.forEach((b) => {
				setBuildingMarker(b);
			})
		);

		$(document).ready(function () {
			$("#lssp-building-modal-form").submit(function (event) {
				event.preventDefault();
				let building = JSON.parse(event.target.getAttribute("data"));
				if (
					event.originalEvent.submitter ==
					document.getElementById("lssp-building-modal-form-delete")
				) {
					deleteFromDB(building.id);
					location.reload();
				} else {
					openEdit(building);
				}
			});
			$("#lssp-building-edit-modal-form").submit(function (event) {
				event.preventDefault();
				let building = JSON.parse(
					document
						.getElementById("lssp-building-edit-modal-form")
						.getAttribute("data")
				);
				const title = $("#lssp-building-edit-modal-form input:text").val();
				const type = $("#lssp-building-edit-modal-form select").val();
				logMessage(`${title} - ${type}`);
				building.name = title;
				building.type = type;
				addToDB(building);
				location.reload();
			});
		});
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
			};

			fr.readAsText(files.item(0));
		};
	}
	main();
})();
