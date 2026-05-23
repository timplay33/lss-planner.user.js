import { Database } from "./db";
import {
	buildBuilding,
	convertDate,
	downloadObjectAsJson,
	logMessage,
} from "./lib";
import { building } from "./lib/classes/building";
import {
	feuerwehrMarkerGroup,
	otherMarkerGroup,
	polizeiMarkerGroup,
	rettungsMarkerGroup,
	schulenMarkerGroup,
	thwMarkerGroup,
} from "./lib/classes/marker";
import { getNotes, notesMarker } from "./lib/notes";
import { Modal_Building, Modal_Building_Edit, Modal_Main } from "./modals";
import BuildingRowTemplate from "./modals/templates/building-row.hbs";
import ExportNotesTemplate from "./modals/templates/export-notes.hbs";
import { appendTemplate, mountTemplate } from "./lib/render";

type BuildingRowData = {
	iconURL: string;
	name: string;
	typeName: string;
};

function renderBuildingRows(
	container: HTMLElement,
	buildings: BuildingRowData[]
): void {
	container.replaceChildren();
	for (const building of buildings) {
		appendTemplate(container, BuildingRowTemplate, building);
	}
}

function bindSaveImport(buildings: building[], db: Database): void {
	$("#lssp-modal-import-save").off("click").one("click", function () {
		void Promise.all(buildings.map((b) => db.addData(b.getAllProperties()))).then(
			() => location.reload()
		);
	});
}
export function SetEventListeners() {
	const db = Database.getInstance();
	// Main Modal
	async function LsspMainModal() {
		Modal_Main.open();
		const buildings = (await db.getAllElements()).sort((a, b) =>
			a.name.localeCompare(b.name)
		);
		const dashBody = document.getElementById("lssp-modal-dash-table-body");
		if (dashBody) {
			renderBuildingRows(
				dashBody,
				buildings.map((b) => ({
					iconURL: b.iconURL,
					name: b.name,
					typeName: b.typeName,
				}))
			);
		}
		// Bind each row link to its corresponding building by index.
		const rowLinks = document.querySelectorAll(
			".lssp-modal-dash-table-body-link"
		) as NodeListOf<HTMLElement>;
		rowLinks.forEach((link, idx) => {
			const building = buildings[idx];
			if (!building) return;
			link.addEventListener("click", () => {
				void Modal_Building.openWithData(building);
			});
		});
	}
	$("#lssp-button").on("click", () => {
		LsspMainModal();
	});

	// Edit Modal
	$("#lssp-building-edit-modal-form").submit(function (event) {
		event.preventDefault();
		let b = new building();
		b.set(JSON.parse(sessionStorage.getItem("active_building") || ""));
		const title: string = $(
			"#lssp-building-edit-modal-form input:text"
		).val() as string;
		const type: number =
			($("#lssp-building-modal-building-type").val() as number) * 1;
		const leitstelle: number =
			($("#lssp-building-modal-building-leitstelle").val() as number) * 1;
		logMessage(`${title} - ${type}`);
		b.name = title;
		b.type = type * 1;
		b.leitstelle = leitstelle * 1;
		if (b.id == 0) {
			void db.addData(b.getWithoutID());
		} else {
			void db.addData(b.getAllProperties());
		}
		location.reload();
	});

	// Building Modal
	$("#lssp-building-modal-form").submit(function (event: any) {
		event.preventDefault();
		let b = new building();
		b.set(JSON.parse(sessionStorage.getItem("active_building") || ""));
		if (
			event.originalEvent.submitter ==
			document.getElementById("lssp-building-modal-form-delete")
		) {
			// Delete Building
			void db.deleteItemById(b.id);
			location.reload();
		} else if (
			event.originalEvent.submitter ==
			document.getElementById("lssp-building-modal-form-build")
		) {
			// Open Building Build Options
			buildBuilding(b);
			logMessage("Building is being built", b.getAllProperties());
		} else {
			// Edit Building
			Modal_Building_Edit.openWithData(b);
		}
	});

	// Export Buildings to JSON
	$("#lssp-modal-export").on("click", async function () {
		const buildings = await db.getAllElements();
		const modifiedBuildings = buildings.map((b) => b.getAllProperties());
		downloadObjectAsJson(
			modifiedBuildings,
			`LSS-Planner-${convertDate(new Date())}`
		);
	});
	// delete all Buildings
	$("#lssp-modal-delete").on("click", async function () {
		if (confirm("Wirklich alles Löschen?")) {
			const buildings = await db.getAllElements();
			await Promise.all(buildings.map((a) => db.deleteItemById(a.id)));
			logMessage("Alles Gelöscht");
			location.reload();
		} else {
			logMessage("Löschen Abgebrochen");
		}
	});
	// Import Buildings from JSON
	$("#lssp-modal-import").on("click", function () {
		var filesInput: HTMLInputElement = document.getElementById(
			"lssp-modal-selectFiles"
		) as HTMLInputElement;
		var files: FileList = filesInput.files as FileList;

		var fr = new FileReader();

		fr.onload = function (e) {
			var result: any = JSON.parse(e.target?.result as string);
			let buildings: building[] = [];
			result.forEach((b: any) => {
				let bd = new building();
				bd.set(b);
				buildings.push(bd);
			});
			const output = document.getElementById("lssp-modal-body-output");
			if (output) {
				renderBuildingRows(
					output,
					buildings.map((b) => ({
						iconURL: b.iconURL,
						name: b.name,
						typeName: b.typeName,
					}))
				);
			}
			bindSaveImport(buildings, db);
		};

		fr.readAsText(files.item(0) as File);
	});

	// Export to Notes
	$("#lssp-modal-export-notes").on("click", async function () {
		logMessage("Saving to Notes...");
		const buildings = await db.getAllElements();
		const modifiedBuildings = buildings.map((b) => b.getAllProperties());

		logMessage("Exporting notes", modifiedBuildings);

		let save = `${notesMarker.start}\n ${JSON.stringify(modifiedBuildings)}\n ${
			notesMarker.end
		}`;

		const div = document.createElement("div");
		mountTemplate(div, ExportNotesTemplate, { save });
		div.style.cssText = "background-color: black;";
		this.parentElement?.append(div);
	});

	// import from Notes
	$("#lssp-modal-import-notes").on("click", async function () {
		const notes = await getNotes();
		let start = notes.search(notesMarker.start);
		let end = notes.search(notesMarker.end);
		let data = notes.substring(start + notesMarker.start.length + 1, end);

		var result: any = JSON.parse(data);
		let buildings: building[] = [];
		result.forEach((b: any) => {
			let bd = new building();
			bd.set(b);
			buildings.push(bd);
		});
		const output = document.getElementById("lssp-modal-body-output");
		if (output) {
			renderBuildingRows(
				output,
				buildings.map((b) => ({
					iconURL: b.iconURL,
					name: b.name,
					typeName: b.typeName,
				}))
			);
		}
		bindSaveImport(buildings, db);
	});

	// hide markers options
	$("#lssp-modal-settings-hide-rd").on("click", function () {
		if (sessionStorage.getItem("isRdHidden") == "true") {
			map.addLayer(rettungsMarkerGroup);
			sessionStorage.setItem("isRdHidden", "false");
			this.textContent = "verstecken";
		} else {
			sessionStorage.setItem("isRdHidden", "true");
			map.removeLayer(rettungsMarkerGroup);
			this.textContent = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-feu").on("click", function () {
		if (sessionStorage.getItem("isFeuHidden") == "true") {
			map.addLayer(feuerwehrMarkerGroup);
			sessionStorage.setItem("isFeuHidden", "false");
			this.textContent = "verstecken";
		} else {
			sessionStorage.setItem("isFeuHidden", "true");
			map.removeLayer(feuerwehrMarkerGroup);
			this.textContent = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-pol").on("click", function () {
		if (sessionStorage.getItem("isPolHidden") == "true") {
			map.addLayer(polizeiMarkerGroup);
			sessionStorage.setItem("isPolHidden", "false");
			this.textContent = "verstecken";
		} else {
			sessionStorage.setItem("isPolHidden", "true");
			map.removeLayer(polizeiMarkerGroup);
			this.textContent = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-thw").on("click", function () {
		if (sessionStorage.getItem("isThwHidden") == "true") {
			map.addLayer(thwMarkerGroup);
			sessionStorage.setItem("isThwHidden", "false");
			this.textContent = "verstecken";
		} else {
			sessionStorage.setItem("isThwHidden", "true");
			map.removeLayer(thwMarkerGroup);
			this.textContent = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-school").on("click", function () {
		if (sessionStorage.getItem("isSchoolHidden") == "true") {
			map.addLayer(schulenMarkerGroup);
			sessionStorage.setItem("isSchoolHidden", "false");
			this.textContent = "verstecken";
		} else {
			sessionStorage.setItem("isSchoolHidden", "true");
			map.removeLayer(schulenMarkerGroup);
			this.textContent = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-other").on("click", function () {
		if (sessionStorage.getItem("isOtherHidden") == "true") {
			map.addLayer(otherMarkerGroup);
			sessionStorage.setItem("isOtherHidden", "false");
			this.textContent = "verstecken";
		} else {
			sessionStorage.setItem("isOtherHidden", "true");
			map.removeLayer(otherMarkerGroup);
			this.textContent = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-all").on("click", function () {
		$("#lssp-modal-settings-hide-rd").trigger("click");
		$("#lssp-modal-settings-hide-feu").trigger("click");
		$("#lssp-modal-settings-hide-pol").trigger("click");
		$("#lssp-modal-settings-hide-thw").trigger("click");
		$("#lssp-modal-settings-hide-school").trigger("click");
		$("#lssp-modal-settings-hide-other").trigger("click");
	});
}
declare const map: L.Map;
