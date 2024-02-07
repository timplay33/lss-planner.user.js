import { db, dictionary } from "./core";
import { getAllElements } from "./db";
import { Modal_Building, Modal_Main } from "./modals";

export function SetEventListeners() {
	async function LsspMainModal() {
		Modal_Main.open();
		await getAllElements(db)
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
                    <td><a id="lssp-modal-dash-table-body-link">${
											b.name
										}</a></td>
                                        <td>${dictionary[b.type].caption}</td>
                </tr>`);
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
