import MainModalTemplate from "./templates/main-modal.hbs";
import BuildingModalTemplate from "./templates/building-modal.hbs";
import BuildingEditModalTemplate from "./templates/building-edit-modal.hbs";
import { AppDictionary } from "../dictionary";
import { Modal, BuildingModal, BuildingEditModal } from "../lib/classes/modal";

let _initialized = false;

export let Modal_Main: Modal;
export let Modal_Building: BuildingModal;
export let Modal_Building_Edit: BuildingEditModal;

export function initModals(): void {
    if (_initialized) return;

    const mainHtml = MainModalTemplate({});
    const buildingHtml = BuildingModalTemplate({});

    const buildingEditHtml = BuildingEditModalTemplate({
        buildingTypes: AppDictionary.getBuildingTypeOptions(),
    });

    Modal_Main = new Modal("lssp-modal", mainHtml);
    Modal_Building = new BuildingModal("lssp-building-modal", buildingHtml);
    Modal_Building_Edit = new BuildingEditModal("lssp-building-edit-modal", buildingEditHtml);

    _initialized = true;
}

export default initModals;
