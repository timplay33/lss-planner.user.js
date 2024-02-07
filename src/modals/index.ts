import { BuildingModal, Modal } from "../lib/modal";
import { BuildingEditModalString } from "./buildingEditModal";
import { BuildingModalString } from "./buildingModal";
import { MainModalString } from "./mainModal";

export const Modal_Main = new Modal(`lssp-modal`, MainModalString);
export const Modal_Building = new BuildingModal(
	`lssp-building-modal`,
	BuildingModalString
);
export const Modal_Building_Edit = new Modal(
	`lssp-building-edit-modal`,
	BuildingEditModalString
);
