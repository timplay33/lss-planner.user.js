import { db, dictionary } from "./core";
import { getAllElements } from "./db";
import { Modal_Building, Modal_Main } from "./modals";

export function SetEventListeners() {
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
}
