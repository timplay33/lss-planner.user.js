const BuildingModalString: string = `<div class="modal-dialog modal-lg" role="document" style="width: 95%; margin: 40px auto">
<div class="modal-content" action="">
    <div class="modal-header">
        <h1 class="modal-title" id="lssp-building-modal-label">LSS-Planner</h1>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <form id="lssp-building-modal-form">
        <div id="lssp-building-modal-body" class="modal-body" style="height: calc(100vh - 350px); overflow-y: auto">
            <div>
                <h1 id="lssp-building-modal-body-title"></h1>
                <p id="lssp-building-modal-body-type"></p>
            </div>
            <p id="lssp-building-modal-body-leitstelle">Leitstelle:</p>
            <p id="lssp-building-modal-body-lat">Latitude:</p>
            <p id="lssp-building-modal-body-lng">Longitude:</p>
            <button type="submit" id="lssp-building-modal-form-build" class="btn btn-success">Bauen</button>
            <button type="submit" id="lssp-building-modal-form-submit" class="btn btn-default">Bearbeiten</button>
            <button type="submit" id="lssp-building-modal-form-delete" data-confirm="Wirklich Löschen?"
                data-method="delete" class="btn btn-danger">Löschen</button>
        </div>
    </form>
</div>
</div>`;

export function addBuildingModal() {
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = `lssp-building-modal`;
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-labelledby", "lssp-building-modal-label");
	modal.setAttribute("aria-hidden", "true");
	modal.style.zIndex = "5000";
	modal.innerHTML = BuildingModalString;
	document.body.appendChild(modal);
}
