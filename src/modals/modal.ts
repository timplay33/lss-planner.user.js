import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";

export class Modal {
	constructor(
		name: string,
		innerHTML: string,
		addLeitstellenSelect: boolean = false
	) {
		const modal = document.createElement("div");
		modal.className = "modal fade";
		modal.id = name;
		modal.setAttribute("tabindex", "-1");
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-labelledby", "lssp-modal-label");
		modal.setAttribute("aria-hidden", "true");
		modal.style.zIndex = "5000";
		modal.innerHTML = innerHTML;
		document.body.appendChild(modal);
		if (addLeitstellenSelect) {
			$.getJSON("../api/buildings", function (data) {
				data = data.filter(
					(leitstelle: Building) => leitstelle.building_type == 7
				);
				data.forEach((leitstelle: Building) => {
					$("#lssp-building-modal-building-leitstelle").append(
						`<option value="${leitstelle.id}">${leitstelle.caption}</option>`
					);
				});
			});
		}
	}
}
