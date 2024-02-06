const MainModalString: string = `<div
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
export function addMainModal() {
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = `lssp-modal`;
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-labelledby", "lssp-modal-label");
	modal.setAttribute("aria-hidden", "true");
	modal.style.zIndex = "5000";
	modal.innerHTML = MainModalString;
	document.body.appendChild(modal);
}
