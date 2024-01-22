// ==UserScript==
// @name         LSS-Planner
// @namespace    https://heidler.eu.org/
// @version      2024-01-22
// @description  LSS-Planner
// @author       Tim Heidler git:@timplay33
// @match        https://www.leitstellenspiel.de/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @grant        none
// ==/UserScript==

(function () {
	("use strict");
	const buildingData = [
		{ name: "building 1", lat: 53.764645, lng: 9.714703 },
		{ name: "building 2", lat: 53.752162, lng: 9.716936 },
		{ name: "building 3", lat: 53.739168, lng: 9.704743 },
	];
	const dbName = "MapTest";
	const scriptName = "MapTest";
	const logIndex = `[${scriptName}]: `;

	const allert = (message) => {
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
				});
				objStore.createIndex("name", "name", { unique: false });
				objStore.createIndex("lat", "lat", { unique: false });
				objStore.createIndex("lng", "lng", { unique: false });
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

			buildings.add(building);
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

	function getAllFromDB(callback) {
		const request = indexedDB.open(dbName, 3);
		request.onsuccess = (event) => {
			const db = event.target.result;

			let transaction = db.transaction("buildings", "readwrite");
			let buildings = transaction.objectStore("buildings");

			let req = buildings.getAll();

			req.onsuccess = (event) => {
				req.result.forEach((building) => {
					callback(building);
				});
			};

			req.onerror = (event) => {
				console.error(logIndex + `Error: "${req.error.name}"`);
			};
		};
		request.onerror = (event) => {
			console.error(logIndex + `Error: "${request.error.name}"`);
		};
	}

	function getByLatLngFromDB(latlng, callback) {
		const request = indexedDB.open(dbName, 3);
		request.onsuccess = (event) => {
			const db = event.target.result;

			let transaction = db.transaction("buildings", "readwrite");
			let buildings = transaction.objectStore("buildings");

			let req = buildings.getAll();

			req.onsuccess = (event) => {
				let data = req.result.filter(
					(building) => building.lat == latlng.lat && building.lng == latlng.lng
				);
				callback(data[0]);
			};

			req.onerror = (event) => {
				console.error(logIndex + `Error: "${req.error.name}"`);
			};
		};
		request.onerror = (event) => {
			console.error(logIndex + `Error: "${request.error.name}"`);
		};
	}

	function openInfo(building) {
		let modal = $(`#lssp-modal`);
		modal.modal("show");

		let modalbody = document.getElementById("lssp-modal-body");
		modalbody.innerHTML = `<h1>${building.name}</h1><span>Latitude: ${building.lat}<br>Longitude: ${building.lng}</span>`;

		//console.log(building);
	}

	function setBuildingMarker(building) {
		let icon = L.icon({
			iconUrl: "/images/building_fire.png",
			iconSize: [32, 37],
			iconAnchor: [16, 37],
		});
		let marker = L.marker([building.lat, building.lng], {
			title: building.name,
			icon: icon,
		}).on("click", onClick);
		marker.addTo(map);
		marker.bindTooltip(building.name);
	}
	function onClick(e) {
		getByLatLngFromDB(e.latlng, openInfo);
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
			console.log(logIndex + "Saving building...");
			let latlng = marker.getLatLng();
			let name = "building 1";
			addToDB({ name: name, lat: latlng.lat, lng: latlng.lng });

			marker.remove();
			$("#col_navbar_holder").append(
				allert(`${name} wurde erfolgreich gespeichert.`)
			);
			sleep(2000).then(() => {
				location.reload();
			});
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
		modal.innerHTML = `<div class="modal-dialog modal-lg" role="document" style="width: 95%; margin: 40px auto;">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title" id="lssp-modal-label">
                    LSS-Planner
                </h1>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="lssp-modal-body" class="modal-body" style="height: calc(100vh - 350px); overflow-y: auto;">
            <h1>Name: </h1><span>Latitude: <br>Longitude: </span>
            </div>
        </div>
    </div>`;
		document.body.appendChild(modal);
	}

	console.log(logIndex + "Starting...");
	createDB();
	addModal();
	//addToDB({ name: "building 2", lat: 53.752162, lng: 9.716936 });
	addButtons();
	getAllFromDB(setBuildingMarker);
})();
