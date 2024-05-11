import { db } from "./core";
import { addData, deleteItemById, getAllElements } from "./db";
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
export function SetEventListeners() {
	// Main Modal
	async function LsspMainModal() {
		Modal_Main.open();
		await getAllElements(db)
			.then((buildings) =>
				buildings.sort((a, b) => a.name.localeCompare(b.name))
			)
			.then((buildings) =>
				buildings.sort().forEach((b) => {
					$("#lssp-modal-dash-table-body").append(
						`<tr><td><img src="${b.iconURL}" alt="icon ${b.typeName}"></td><td><a id="lssp-modal-dash-table-body-link">${b.name}</a></td><td>${b.typeName}</td></tr>`
					);
					let Buttons = document.querySelectorAll(
						`#lssp-modal-dash-table-body-link`
					);
					let lastButton = Buttons[Buttons.length - 1];
					lastButton.addEventListener("click", () => {
						Modal_Building.openWithData(b);
					});
				})
			);
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
			addData(db, b.getWithoutID());
		} else {
			addData(db, b.getAllProperties());
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
			deleteItemById(db, b.id);
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
		let buildings = await getAllElements(db);
		let modifiedBuildings = buildings.map((b) => b.getAllProperties());
		downloadObjectAsJson(
			modifiedBuildings,
			`LSS-Planner-${convertDate(new Date())}`
		);
	});
	// delete all Buildings
	$("#lssp-modal-delete").on("click", async function () {
		if (confirm("Wirklich alles Löschen?")) {
			await getAllElements(db).then((b) => {
				b.forEach((a) => deleteItemById(db, a.id));
				logMessage("Alles Gelöscht");
				location.reload();
			});
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
			console.log(buildings);
			buildings.forEach((b) => {
				$("#lssp-modal-body-output").append(`
						<tr>
						<td ><img src="${b.iconURL}" alt="icon ${b.typeName}"></td>
						<td >${b.name}</td>
						<td >${b.typeName}</td>
					</tr>`);
			});
			$("#lssp-modal-import-save").on("click", function () {
				buildings.forEach((b) => {
					addData(db, b.getAllProperties());
					location.reload();
				});
			});
		};

		fr.readAsText(files.item(0) as File);
	});

	// Export to Notes
	$("#lssp-modal-export-notes").on("click", async function () {
		logMessage("Saving to Notes...");
		let buildings = await getAllElements(db);
		let modifiedBuildings = buildings.map((b) => b.getAllProperties());

		console.log(modifiedBuildings);

		let save = `${notesMarker.start}\n ${JSON.stringify(modifiedBuildings)}\n ${
			notesMarker.end
		}`;

		let msg = `<h2>This feature is currently disabled! But you may copy the text below into your notes:</h2> \n${save}`;

		const div = document.createElement("div");
		div.innerHTML = msg;
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
		console.log(buildings);
		buildings.forEach((b) => {
			$("#lssp-modal-body-output").append(`
				<tr>
				<td ><img src="${b.iconURL}" alt="icon ${b.typeName}"></td>
				<td >${b.name}</td>
				<td >${b.typeName}</td>
			</tr>`);
		});
		$("#lssp-modal-import-save").on("click", function () {
			buildings.forEach((b) => {
				addData(db, b.getAllProperties());
				location.reload();
			});
		});
	});

	// hide markers options
	$("#lssp-modal-settings-hide-rd").on("click", function () {
		if (sessionStorage.getItem("isRdHidden") == "true") {
			map.addLayer(rettungsMarkerGroup);
			sessionStorage.setItem("isRdHidden", "false");
			this.innerHTML = "verstecken";
		} else {
			sessionStorage.setItem("isRdHidden", "true");
			map.removeLayer(rettungsMarkerGroup);
			this.innerHTML = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-feu").on("click", function () {
		if (sessionStorage.getItem("isFeuHidden") == "true") {
			map.addLayer(feuerwehrMarkerGroup);
			sessionStorage.setItem("isFeuHidden", "false");
			this.innerHTML = "verstecken";
		} else {
			sessionStorage.setItem("isFeuHidden", "true");
			map.removeLayer(feuerwehrMarkerGroup);
			this.innerHTML = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-pol").on("click", function () {
		if (sessionStorage.getItem("isPolHidden") == "true") {
			map.addLayer(polizeiMarkerGroup);
			sessionStorage.setItem("isPolHidden", "false");
			this.innerHTML = "verstecken";
		} else {
			sessionStorage.setItem("isPolHidden", "true");
			map.removeLayer(polizeiMarkerGroup);
			this.innerHTML = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-thw").on("click", function () {
		if (sessionStorage.getItem("isThwHidden") == "true") {
			map.addLayer(thwMarkerGroup);
			sessionStorage.setItem("isThwHidden", "false");
			this.innerHTML = "verstecken";
		} else {
			sessionStorage.setItem("isThwHidden", "true");
			map.removeLayer(thwMarkerGroup);
			this.innerHTML = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-school").on("click", function () {
		if (sessionStorage.getItem("isSchoolHidden") == "true") {
			map.addLayer(schulenMarkerGroup);
			sessionStorage.setItem("isSchoolHidden", "false");
			this.innerHTML = "verstecken";
		} else {
			sessionStorage.setItem("isSchoolHidden", "true");
			map.removeLayer(schulenMarkerGroup);
			this.innerHTML = "zeigen";
		}
	});
	$("#lssp-modal-settings-hide-other").on("click", function () {
		if (sessionStorage.getItem("isOtherHidden") == "true") {
			map.addLayer(otherMarkerGroup);
			sessionStorage.setItem("isOtherHidden", "false");
			this.innerHTML = "verstecken";
		} else {
			sessionStorage.setItem("isOtherHidden", "true");
			map.removeLayer(otherMarkerGroup);
			this.innerHTML = "zeigen";
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
