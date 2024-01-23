// ==UserScript==
// @name         LSS-Planner
// @namespace    https://heidler.eu.org/
// @version      2024-01-22
// @description  LSS-Planner
// @author       Tim Heidler git:@timplay33
// @match        https://www.leitstellenspiel.de/
// @icon         https://www.leitstellenspiel.de/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
	("use strict");
	const buildingData = [
		{ name: "building 1", lat: 53.764645, lng: 9.714703, type: 0 },
	];
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
	};
	const logIndex = `[${scriptName}]: `;

	const alertMessage = (message) => {
		return `<div class="alert fade in alert-success "><button class="close" data-dismiss="alert" type="button">×</button>${message}</div>`;
	};

	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
				console.log(logIndex + `Created DB: ${dbName}`);
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
			console.log(logIndex + `Added: "${building?.name}"`);

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
				console.log(logIndex + `Deleted: "${id}", error: "${req.error.name}"`);
			};
			req.onsuccess = (event) => {
				console.log(logIndex + `Deleted: "${id}"`);
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

	function openInfo(building) {
		let modal = $(`#lssp-modal`);
		modal.modal("show");
		document
			.getElementById(`lssp-modal-form`)
			.setAttribute("data", JSON.stringify(building));
		let modal_title = document.getElementById("lssp-modal-body-title");
		modal_title.innerHTML = `${building.name}`;

		let modal_type = document.getElementById("lssp-modal-body-type");
		modal_type.innerHTML = `${dictionary[building.type].caption}`;

		let modal_lat = document.getElementById("lssp-modal-body-lat");
		modal_lat.innerHTML = `Latitude: ${building.lat}`;

		let modal_lng = document.getElementById("lssp-modal-body-lng");
		modal_lng.innerHTML = `Longitude: ${building.lng}`;

		//console.log(building);
	}
	function openEdit(building) {
		let modal = $(`#lssp-edit-modal`);
		modal.modal("show");
		document
			.getElementById(`lssp-edit-modal-form`)
			.setAttribute("data", JSON.stringify(building));

		let modal_title = document.getElementById("lssp-modal-building-name");
		modal_title.setAttribute("value", building.name);

		let modal_type = document.getElementById("lssp-modal-building-type");
		document
			.querySelector(`[value="${building.type}"]`)
			.setAttribute("selected", "selected");
		modal_type.setAttribute("value", building.type);

		//console.log(building);
	}
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
	async function onClick(e) {
		openInfo(await getFromDB(parseInt(e.target._icon.id)));
	}
	function addButtons() {
		//console.log(logIndex + "Adding buttons...");
		//let loc = $(".leaflet-bottom leaflet-left");
		L.Control.MyControl = L.Control.extend({
			onAdd: function (map) {
				var el = L.DomUtil.create("div", "leaflet-bar my-control");

				el.innerHTML = `
                <button id="plan-new-building" class="btn btn-xs ajax btn-default" >Neues Gebäude planen</button>
                <button id="save-plan-new-building" class="btn btn-xs ajax btn-default" >Speichern</button>`;

				return el;
			},

			onRemove: function (map) {
				// Nothing to do here
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
	function addBuilding() {
		function saveBuilding() {
			$("#lssp-edit-modal").modal("show");
			let latlng = marker.getLatLng();
			document.getElementById(`lssp-edit-modal-form`).setAttribute(
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

		console.log(logIndex + "Adding building...");
		let center = map.getCenter();
		let marker = L.marker([center.lat, center.lng], {
			draggable: true,
			zIndexOffset: 100000,
		}).addTo(map);
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
			<form id="lssp-modal-form">
				<div
					id="lssp-modal-body"
					class="modal-body"
					style="height: calc(100vh - 350px); overflow-y: auto"
				>
					<div>
						<h1 id="lssp-modal-body-title"></h1>
						<span id="lssp-modal-body-type"></span>
					</div>
					<p id="lssp-modal-body-lat">Latitude:</p>
					<p id="lssp-modal-body-lng">Longitude:</p>
					<button type="submit" id="lssp-modal-form-submit" class="btn btn-default">Bearbeiten</button>
				</div>
			</form>
		</div>
	</div>
	
		`;
		document.body.appendChild(modal);
	}

	function addEditModal() {
		const modal = document.createElement("div");
		modal.className = "modal fade";
		modal.id = `lssp-edit-modal`;
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-labelledby", "lssp-edit-modal-label");
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
			<h1 class="modal-title" id="lssp-edit-modal-label">LSS-Planner</h1>
			<button
				type="button"
				class="close"
				data-dismiss="modal"
				aria-label="Close"
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<form id="lssp-edit-modal-form">
			<div
				id="lssp-edit-modal-body"
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
								id="lssp-modal-building-name"
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
								for="lssp-modal-building-type"
								><abbr title="required">*</abbr> Gebäudetyp</label
							>
						</div>

						<select
							class="select required form-control"
							id="lssp-modal-building-type"
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
					id="lssp-edit-modal-form-submit"
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

	async function main() {
		console.log(logIndex + "Starting...");
		createDB();
		addModal();
		addEditModal();
		addButtons();

		// Placing Markers from DB
		await getAllFromDB().then((buildings) =>
			buildings.forEach((b) => {
				setBuildingMarker(b);
			})
		);

		$(document).ready(function () {
			$("#lssp-modal-form").submit(function (event) {
				event.preventDefault();
				let building = JSON.parse(event.target.getAttribute("data"));
				//console.log(building);
				event.target.addEventListener("submit", openEdit(building));
			});
			$("#lssp-edit-modal-form").submit(function (event) {
				console.log(event);
				event.preventDefault();
				let building = JSON.parse(
					document.getElementById("lssp-edit-modal-form").getAttribute("data")
				);
				const title = $("#lssp-edit-modal-form input:text").val();
				const type = $("#lssp-edit-modal-form select").val();
				console.log(logIndex + `${title} - ${type}`);
				building.name = title;
				building.type = type;
				addToDB(building);
				location.reload();
			});
		});
	}
	main();
})();
