import { BuildingEditModal, BuildingModal, Modal } from "../lib/classes/modal";
import {
	BuildingEditModalString,
	BuildingModalString,
	MainModalString,
} from "./Modals";

export const Modal_Main = new Modal(`lssp-modal`, MainModalString);
export const Modal_Building = new BuildingModal(
	`lssp-building-modal`,
	BuildingModalString
);
export const Modal_Building_Edit = new BuildingEditModal(
	`lssp-building-edit-modal`,
	BuildingEditModalString
);
