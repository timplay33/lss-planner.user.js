function addModal() {
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = `lssp-modal`;
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-labelledby", "lssp-modal-label");
	modal.setAttribute("aria-hidden", "true");
	modal.style.zIndex = "5000";
	modal.innerHTML = `
    <div
    class="modal-dialog modal-lg"
    role="document"
    style="width: 95%; margin: 40px auto"
>
    <div class="modal-content" action="">
        <div class="modal-header">
            <h1 class="modal-title" id="lssp-modal-label">LSS-Planner</h1>
            <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div
            id="lssp-modal-body"
            class="modal-body"
            style="height: calc(100vh - 350px); overflow-y: auto"
        >
            <div>
                <ul class="nav nav-tabs" role="tablist" style="margin-bottom: 10px">
                    <li role="presentation" class="active">
                        <a
                            href="#lssp-modal-dash-panel"
                            aria-controls="lssp-modal-dash-panel"
                            role="tab"
                            data-toggle="tab"
                        >
                            Übersicht
                        </a>
                    </li>
                    <li role="presentation">
                        <a
                            href="#lssp-modal-backup-panel"
                            aria-controls="lssp-modal-backup-panel"
                            role="tab"
                            data-toggle="tab"
                        >
                            BackUp
                        </a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div
                        role="tabpanel"
                        class="tab-pane active"
                        id="lssp-modal-dash-panel"
                    >
                        <table
                            id="lssp-modal-dash-table"
                            class="table table-striped tablesorter tablesorter-default"
                            role="grid"
                        >
                            <thead>
                                <tr class="tablesorter-headerRow" role="row">
                                    <th></th>
                                    <th>Name</th>
                                    <th>Typ</th>
                                </tr>
                            </thead>
                            <tbody
                                id="lssp-modal-dash-table-body"
                                aria-live="polite"
                                aria-relevant="all"
                            ></tbody>
                        </table>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="lssp-modal-backup-panel">
                        <div>
                            <h2>JSON-Datei</h2>
                            <input
                                type="file"
                                id="lssp-modal-selectFiles"
                                value="Import"
                            /><br />
                            <button id="lssp-modal-import" class="btn btn-default">
                                Importieren
                            </button>
                            <button id="lssp-modal-export" class="btn btn-success">
                                Herunterladen
                            </button>
                        </div>
                        <div>
                            <h2>Notizen</h2>
                            <button id="lssp-modal-export-notes" class="btn btn-success">
                                in Notizen Exportieren
                            </button>
                            <button id="lssp-modal-import-notes" class="btn btn-success">
                                aus Notizen Importieren
                            </button>
                        </div>
                        <div>
                            <h2>Zu Importierende Daten</h2>

                            <table
                                class="table table-striped tablesorter tablesorter-default"
                            >
                                <thead>
                                    <tr class="tablesorter-headerRow" role="row">
                                        <th></th>
                                        <th>Name</th>
                                        <th>Typ</th>
                                    </tr>
                                </thead>
                                <tbody id="lssp-modal-body-output"></tbody>
                            </table>
                            <button
                                id="lssp-modal-import-save"
                                class="btn btn-success"
                                type="button"
                            >
                                Speichern
                            </button>
                            <button id="lssp-modal-delete" class="btn btn-danger">
                                Alles Löschen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

`;
	document.body.appendChild(modal);
}
function addBuildingEditModal() {
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = `lssp-building-edit-modal`;
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-labelledby", "lssp-building-edit-modal-label");
	modal.setAttribute("aria-hidden", "true");
	modal.style.zIndex = "5000";
	modal.innerHTML = `
    <div class="modal-dialog modal-lg" role="document" style="width: 95%; margin: 40px auto">
        <div class="modal-content" action="">
            <div class="modal-header">
                <h1 class="modal-title" id="lssp-building-edit-modal-label">LSS-Planner</h1>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="lssp-building-edit-modal-form">
                <div id="lssp-building-edit-modal-body" class="modal-body"
                    style="height: calc(100vh - 350px); overflow-y: auto">
                    <div class="col-md-12 col-xs-12">
                        <div id="building_name_step">
                            <div class="input-group string required building_name">
                                <div class="input-group-addon">
                                    <label class="string required" for="building_name"><abbr title="required">*</abbr>
                                        Name</label>
                                </div>
                                <input class="string required form-control" id="lssp-building-modal-building-name"
                                    maxlength="40" name="building[name]" size="50" type="text" control-id="ControlID-14" />
                            </div>
                        </div>
                        <div class="input-group select required building_building_type">
                            <div class="input-group-addon">
                                <label class="integer required select required"
                                    for="lssp-building-modal-building-type"><abbr title="required">*</abbr>
                                    Gebäudetyp</label>
                            </div>

                            <select class="select required form-control" id="lssp-building-modal-building-type"
                                name="building[building_type]">
                                <option value=""></option>
                                <option value="7">Leitstelle</option>
                                <option value="0">Feuerwache</option>
                                <option value="18">Feuerwache (Kleinwache)</option>
                                <option value="1">Feuerwehrschule</option>
                                <option value="2">Rettungswache</option>
                                <option value="20">Rettungswache (Kleinwache)</option>
                                <option value="3">Rettungsschule</option>
                                <option value="4">Krankenhaus</option>
                                <option value="5">Rettungshubschrauber-Station</option>
                                <option value="12">Schnelleinsatzgruppe (SEG)</option>
                                <option value="6">Polizeiwache</option>
                                <option value="19">Polizeiwache (Kleinwache)</option>
                                <option value="11">Bereitschaftspolizei</option>
                                <option value="17">Polizei-Sondereinheiten</option>
                                <option value="24">Reiterstaffel</option>
                                <option value="13">Polizeihubschrauberstation</option>
                                <option value="8">Polizeischule</option>
                                <option value="9">THW</option>
                                <option value="10">THW Bundesschule</option>
                                <option value="14">Bereitstellungsraum</option>
                                <option value="15">Wasserrettung</option>
                                <option value="21">Rettungshundestaffel</option>
                            </select>
                        </div>
                        <div class="input-group select required building_building_type">
                            <div class="input-group-addon">
                                <label class="integer optional select required"
                                    for="lssp-building-modal-building-leitstelle">Zugeordnete Leitstelle</label>
                            </div>
                            <select class="select required form-control" id="lssp-building-modal-building-leitstelle"
                                name="building[building_type]">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" id="lssp-building-edit-modal-form-submit" class="btn btn-default">
                        Speichern
                    </button>
                </div>
            </form>
        </div>
    </div>`;
	document.body.appendChild(modal);
	$.getJSON("../api/buildings", function (data) {
		data = data.filter((l) => l.building_type == 7);
		data.forEach((l) => {
			$("#lssp-building-modal-building-leitstelle").append(
				`<option value="${l.id}">${l.caption}</option>`
			);
		});
	});
}

function addBuildingModal() {
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = `lssp-building-modal`;
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-labelledby", "lssp-building-modal-label");
	modal.setAttribute("aria-hidden", "true");
	modal.style.zIndex = "5000";
	modal.innerHTML = `
    <div class="modal-dialog modal-lg" role="document" style="width: 95%; margin: 40px auto">
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
	document.body.appendChild(modal);
}
