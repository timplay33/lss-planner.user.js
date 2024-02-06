import { addBuildingEditModal } from "../modals/buildingEditModal";
import { addBuildingModal } from "../modals/buildingModal";
import { addMainModal } from "../modals/mainModal";

export function logMessage(message: string): void {
	console.log(
		`[${sessionStorage.getItem("scriptName") || "LSS-Planner"}]: ` + message
	);
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function addModals() {
	addMainModal();
	addBuildingModal();
	addBuildingEditModal();
}
