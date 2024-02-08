import { db, dictionary } from "./core";
import { addData, deleteItemById, getAllElements } from "./db";
import { logMessage } from "./lib";
import { building } from "./lib/classes/building";
import { Modal_Building, Modal_Building_Edit, Modal_Main } from "./modals";
export function SetEventListeners() {
	// Main Modal
	async function LsspMainModal() {
		Modal_Main.open();
		await getAllElements(db)
			.then((buildings) =>
				buildings.sort((a, b) => a.get().name.localeCompare(b.get().name))
			)
			.then((buildings) =>
				buildings.sort().forEach((b) => {
					$("#lssp-modal-dash-table-body").append(
						`<tr><td><img src="${b.getIconURL()}" alt="icon ${b.getTypeName()}"></td><td><a id="lssp-modal-dash-table-body-link">${
							b.name
						}</a></td><td>${b.getTypeName()}</td></tr>`
					);
					let Buttons = document.querySelectorAll(
						`#lssp-modal-dash-table-body-link`
					);
					let lastButton = Buttons[Buttons.length - 1];
					lastButton.addEventListener("click", () => {
						console.log(b);
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
		b.set(
			JSON.parse(
				document
					.getElementById("lssp-building-edit-modal-form")
					?.getAttribute("data") || "{}"
			)
		);
		const title: string = $(
			"#lssp-building-edit-modal-form input:text"
		).val() as string;
		const type: number = $(
			"#lssp-building-modal-building-type"
		).val() as number;
		const leitstelle: number = $(
			"#lssp-building-modal-building-leitstelle"
		).val() as number;
		logMessage(`${title} - ${type}`);
		b.name = title;
		b.type = type;
		b.leitstelle = leitstelle;
		console.log(b.get());
		let bd = b.get() as any;
		if (bd.id == null) {
			delete bd.id;
		}
		addData(db, bd);
		location.reload();
	});

	// Building Modal
	$("#lssp-building-modal-form").submit(function (event: any) {
		event.preventDefault();
		let building = JSON.parse(event.target.getAttribute("data"));
		if (
			event.originalEvent.submitter ==
			document.getElementById("lssp-building-modal-form-delete")
		) {
			// Delete Building
			deleteItemById(db, building.id);
			location.reload();
		} else if (
			event.originalEvent.submitter ==
			document.getElementById("lssp-building-modal-form-build")
		) {
			// Open Building Build Options
			//buildBuilding(building);
			console.log("Building Buildings is currently not implemented", building);
		} else {
			// Edit Building
			Modal_Building_Edit.openWithData(building);
		}
	});
}
