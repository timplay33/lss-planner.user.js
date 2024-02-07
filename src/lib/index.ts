import { Modal } from "../modals/modal";

export function logMessage(message: string): void {
	console.log(
		`[${sessionStorage.getItem("scriptName") || "LSS-Planner"}]: ` + message
	);
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

import { BuildingEditModalString } from "./../modals/buildingEditModal";
import { BuildingModalString } from "./../modals/buildingModal";
import { MainModalString } from "./../modals/mainModal";

export function addModals() {
	const main = new Modal(`lssp-modal`, MainModalString);
	const building = new Modal(`lssp-building-modal`, BuildingModalString);
	const edit = new Modal(
		`lssp-building-edit-modal`,
		BuildingEditModalString,
		true
	);
	console.log(main);
}
