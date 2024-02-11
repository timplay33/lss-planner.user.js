import { db } from "./core";
import { addData, deleteItemById, getAllElements } from "./db";
import {
	buildBuilding,
	convertDate,
	downloadObjectAsJson,
	logMessage,
} from "./lib";
import { building } from "./lib/classes/building";
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
}
