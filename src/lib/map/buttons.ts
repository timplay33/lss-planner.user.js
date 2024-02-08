import { logMessage } from "..";
import { building } from "../classes/building";

declare const map: L.Map;
declare var L: any;

export function addButtonsToMap() {
	L.Control.MyControl = L.Control.extend({
		onAdd: function () {
			var el = L.DomUtil.create("div", "leaflet-bar my-control");

			el.innerHTML = `<button id="plan-new-building" class="btn btn-xs ajax btn-default">Neues Gebäude planen</button><button id="save-plan-new-building" class="btn btn-xs ajax btn-default">Speichern</button>`;

			return el;
		},
	});

	L.control.myControl = function (opts: any) {
		return new L.Control.MyControl(opts);
	};

	L.control
		.myControl({
			position: "bottomleft",
		})
		.addTo(map);

	if (document.getElementById("plan-new-building")) {
		document
			.getElementById("plan-new-building")
			?.addEventListener("click", addBuilding, false);
	}
	if (document.getElementById("save-plan-new-building")) {
		document
			.getElementById("save-plan-new-building")
			?.setAttribute("disabled", "true");
	}
}

function addBuilding() {
	function saveBuilding() {
		$("#lssp-building-edit-modal").modal("show");
		let b = new building();
		b.type = 0;
		let latlng = marker.getLatLng();
		b.setLatLng(latlng);
		if (document.getElementById(`lssp-building-edit-modal-form`)) {
			document
				.getElementById(`lssp-building-edit-modal-form`)
				?.setAttribute("data", JSON.stringify(b.get()));
		}

		$("#lssp-building-modal-building-name").val(b.get().name);
		$("#lssp-building-modal-building-type").val(b.get().type);
		$("#lssp-building-modal-building-leitstelle").val(b.get().leitstelle);
	}

	let btn = document.getElementById("plan-new-building");
	let saveButton = document.getElementById("save-plan-new-building");

	btn?.setAttribute("disabled", "true");
	saveButton?.removeAttribute("disabled");

	if (document.getElementById("save-plan-new-building")) {
		document
			.getElementById("save-plan-new-building")
			?.addEventListener("click", saveBuilding, false);
	}
	logMessage("Adding building...");
	let center = map.getCenter();
	let marker = L.marker([center.lat, center.lng], {
		draggable: true,
		zIndexOffset: 100000,
	}).addTo(map);
}
