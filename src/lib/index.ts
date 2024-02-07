import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";

export function logMessage(message: string): void {
	console.log(
		`[${sessionStorage.getItem("scriptName") || "LSS-Planner"}]: ` + message
	);
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function addMenuEntry() {
	/** Add divider  */
	let divider = document.createElement("li");
	divider.setAttribute("class", "divider");
	divider.setAttribute("role", "presentation");
	document
		.getElementById("logout_button")
		?.parentElement?.parentElement?.appendChild(divider);

	/** Add button */
	let button = document.createElement("a");
	button.setAttribute("href", "javascript: void(0)");
	button.setAttribute("id", "lssp-button");
	button.append("Lss-Planner");
	let button_li = document.createElement("li");
	button_li.appendChild(button);
	document
		.getElementById("logout_button")
		?.parentElement?.parentElement?.appendChild(button_li);
}

export function addLeitstellenToEditModal() {
	$.getJSON("../api/buildings", function (data) {
		data = data.filter((leitstelle: Building) => leitstelle.building_type == 7);
		data.forEach((leitstelle: Building) => {
			$("#lssp-building-modal-building-leitstelle").append(
				`<option value="${leitstelle.id}">${leitstelle.caption}</option>`
			);
		});
	});
}
