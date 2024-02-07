import { Building } from "@lss-manager/missionchief-type-definitions/src/api/Building";
import { dictionary } from "../core";
import { LsspBuilding } from "../types/types";

export class Modal {
	name: string;
	constructor(name: string, innerHTML: string) {
		this.name = name;
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
	}
	public close() {
		$("#" + this.name).modal("hide");
	}
	public open() {
		$("#" + this.name).modal("show");
	}
}

export class BuildingModal extends Modal {
	public openWithData(building: LsspBuilding): void {
		this.open();
		document
			.getElementById(`lssp-building-modal-form`)
			?.setAttribute("data", JSON.stringify(building));
		let modal_title = document.getElementById("lssp-building-modal-body-title");
		modal_title ? (modal_title.innerHTML = `${building.name}`) : null;

		let modal_type = document.getElementById("lssp-building-modal-body-type");
		modal_type
			? (modal_type.innerHTML = `${dictionary[building.type].caption}`)
			: null;

		let modal_lat = document.getElementById("lssp-building-modal-body-lat");
		modal_lat ? (modal_lat.innerHTML = `Latitude: ${building.lat}`) : null;

		let modal_lng = document.getElementById("lssp-building-modal-body-lng");
		modal_lng ? (modal_lng.innerHTML = `Longitude: ${building.lng}`) : null;

		let modal_leitstelle = document.getElementById(
			"lssp-building-modal-body-leitstelle"
		);
		$.getJSON("../api/buildings", function (data: Building[]) {
			data = data.filter((l) => l.id == building.leitstelle);
			modal_leitstelle
				? (modal_leitstelle.innerHTML = `Leitstelle: ${data[0]?.caption || ""}`)
				: null;
		});
	}
}
