import { db } from "./core";
import { addData, deleteItemById, getAllElements } from "./db";
import { buildBuilding, logMessage } from "./lib";
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
			console.log(
				"Building Buildings is currently not implemented",
				b.getAllProperties()
			);
		} else {
			// Edit Building
			Modal_Building_Edit.openWithData(b);
		}
	});
}
