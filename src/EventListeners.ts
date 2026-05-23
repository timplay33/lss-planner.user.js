import { AppDictionary } from "./dictionary";
import { Database } from "./db";
import {
	buildBuilding,
	convertDate,
	downloadObjectAsJson,
	logMessage,
} from "./lib";
import { building } from "./lib/classes/building";
import {
	isCategoryHidden,
	setCategoryVisibility,
} from "./lib/classes/marker";
import { getNotes, notesMarker } from "./lib/notes";
import { appendTemplate, mountTemplate } from "./lib/render";
import { Modal_Building, Modal_Building_Edit, Modal_Main } from "./modals";
import BuildingRowTemplate from "./modals/templates/building-row.hbs";
import CategoryRowTemplate from "./modals/templates/category-row.hbs";
import ExportNotesTemplate from "./modals/templates/export-notes.hbs";

type BuildingRowData = {
	id?: number;
	iconURL: string;
	name: string;
	typeName: string;
	category: string;
};

type CategoryRowData = {
	category: string;
	count: number;
};

type DashboardSort = "category-name" | "category-type" | "name" | "type";

const germanCollator = new Intl.Collator("de", { sensitivity: "base" });

function renderBuildingRows(
	container: HTMLElement,
	buildings: BuildingRowData[]
): void {
	for (const building of buildings) {
		appendTemplate(container, BuildingRowTemplate, building);
	}
}

function renderCategoryRow(container: HTMLElement, categoryRow: CategoryRowData): void {
	appendTemplate(container, CategoryRowTemplate, categoryRow);
}

function matchesSearch(building: building, searchTerm: string): boolean {
	if (!searchTerm) return true;
	const haystack = [building.name, building.typeName, building.category]
		.join(" ")
		.toLocaleLowerCase("de");
	return haystack.includes(searchTerm);
}

function sortBuildings(buildings: building[], sort: DashboardSort): building[] {
	return [...buildings].sort((buildingA, buildingB) => {
		const categoryCompare = germanCollator.compare(
			buildingA.category,
			buildingB.category
		);
		const nameCompare = germanCollator.compare(buildingA.name, buildingB.name);
		const typeCompare = germanCollator.compare(
			buildingA.typeName,
			buildingB.typeName
		);

		switch (sort) {
			case "category-type":
				return categoryCompare || typeCompare || nameCompare;
			case "name":
				return nameCompare || categoryCompare || typeCompare;
			case "type":
				return typeCompare || nameCompare || categoryCompare;
			case "category-name":
			default:
				return categoryCompare || nameCompare || typeCompare;
		}
	});
}

function toBuildingRowData(b: building): BuildingRowData {
	return {
		id: b.id,
		iconURL: b.iconURL,
		name: b.name,
		typeName: b.typeName,
		category: b.category,
	};
}

function renderDashboard(buildings: building[]): void {
	const dashBody = document.getElementById("lssp-modal-dash-table-body");
	if (!dashBody) return;

	const searchTerm = (
		document.getElementById("lssp-modal-dash-search") as HTMLInputElement | null
	)?.value.trim().toLocaleLowerCase("de") ?? "";
	const sort = (
		(document.getElementById("lssp-modal-dash-sort") as HTMLSelectElement | null)
			?.value ?? "category-name"
	) as DashboardSort;
	const visibleBuildings = sortBuildings(
		buildings.filter((b) => matchesSearch(b, searchTerm)),
		sort
	);

	dashBody.replaceChildren();
	if (sort.startsWith("category")) {
		const grouped = new Map<string, building[]>();
		for (const b of visibleBuildings) {
			const categoryBuildings = grouped.get(b.category) ?? [];
			categoryBuildings.push(b);
			grouped.set(b.category, categoryBuildings);
		}

		for (const [category, categoryBuildings] of grouped) {
			renderCategoryRow(dashBody, {
				category,
				count: categoryBuildings.length,
			});
			renderBuildingRows(dashBody, categoryBuildings.map(toBuildingRowData));
		}
	} else {
		renderBuildingRows(dashBody, visibleBuildings.map(toBuildingRowData));
	}

	const buildingsById = new Map(buildings.map((b) => [String(b.id), b]));
	const rowLinks = dashBody.querySelectorAll(
		".lssp-modal-dash-table-body-link"
	) as NodeListOf<HTMLElement>;
	rowLinks.forEach((link) => {
		const selectedBuilding = buildingsById.get(link.dataset.buildingId || "");
		if (!selectedBuilding) return;
		link.addEventListener("click", () => {
			void Modal_Building.openWithData(selectedBuilding);
		});
	});
}

function bindSaveImport(buildings: building[], db: Database): void {
	$("#lssp-modal-import-save").off("click").one("click", function () {
		void Promise.all(buildings.map((b) => db.addData(b.getAllProperties()))).then(
			() => location.reload()
		);
	});
}

function syncCategorySettingsButtons(): void {
	const categories = AppDictionary.getCategories();
	const allHidden = categories.every((category) => isCategoryHidden(category));
	const allButton = document.getElementById("lssp-modal-settings-hide-all");
	if (allButton) {
		allButton.textContent = allHidden ? "Alle zeigen" : "Alle verstecken";
	}

	for (const category of categories) {
		const button = document.querySelector<HTMLButtonElement>(
			`[data-lssp-category-toggle="${CSS.escape(category)}"]`
		);
		if (!button) continue;
		button.textContent = isCategoryHidden(category) ? "zeigen" : "verstecken";
	}
}

function renderCategorySettings(): void {
	const container = document.getElementById("lssp-modal-settings-categories");
	if (!container) return;

	container.replaceChildren();
	for (const category of AppDictionary.getCategories()) {
		const row = document.createElement("div");
		row.className = "form-inline";
		row.style.marginBottom = "10px";

		const label = document.createElement("strong");
		label.textContent = category;
		label.style.display = "inline-block";
		label.style.minWidth = "180px";

		const button = document.createElement("button");
		button.type = "button";
		button.className = "btn btn-default";
		button.dataset.lsspCategoryToggle = category;
		button.addEventListener("click", () => {
			setCategoryVisibility(category, isCategoryHidden(category));
			syncCategorySettingsButtons();
		});

		row.append(label, button);
		container.appendChild(row);
	}

	syncCategorySettingsButtons();
}

function renderImportRows(output: HTMLElement, buildings: building[]): void {
	output.replaceChildren();
	renderBuildingRows(output, buildings.map(toBuildingRowData));
}

export function SetEventListeners() {
	const db = Database.getInstance();
	renderCategorySettings();

	async function LsspMainModal() {
		Modal_Main.open();
		renderDashboard(await db.getAllElements());
	}

	$("#lssp-button").on("click", () => {
		void LsspMainModal();
	});
	$("#lssp-modal-dash-search").on("input", async () => {
		renderDashboard(await db.getAllElements());
	});
	$("#lssp-modal-dash-sort").on("change", async () => {
		renderDashboard(await db.getAllElements());
	});
	$("#lssp-modal-dash-clear-search").on("click", async () => {
		$("#lssp-modal-dash-search").val("");
		renderDashboard(await db.getAllElements());
	});

	$("#lssp-building-edit-modal-form").submit(function (event) {
		event.preventDefault();
		let b = new building();
		b.set(JSON.parse(sessionStorage.getItem("active_building") || ""));
		const title: string = $(
			"#lssp-building-edit-modal-form input:text"
		).val() as string;
		const type: number =
			($("#lssp-building-modal-building-type").val() as number) * 1;
		const leitstelle: number =
			($("#lssp-building-modal-building-leitstelle").val() as number) * 1;
		logMessage(`${title} - ${type}`);
		b.name = title;
		b.type = type * 1;
		b.leitstelle = leitstelle * 1;
		if (b.id == 0) {
			void db.addData(b.getWithoutID());
		} else {
			void db.addData(b.getAllProperties());
		}
		location.reload();
	});

	$("#lssp-building-modal-form").submit(function (event: any) {
		event.preventDefault();
		let b = new building();
		b.set(JSON.parse(sessionStorage.getItem("active_building") || ""));
		if (
			event.originalEvent.submitter ==
			document.getElementById("lssp-building-modal-form-delete")
		) {
			void db.deleteItemById(b.id);
			location.reload();
		} else if (
			event.originalEvent.submitter ==
			document.getElementById("lssp-building-modal-form-build")
		) {
			buildBuilding(b);
			logMessage("Building is being built", b.getAllProperties());
		} else {
			Modal_Building_Edit.openWithData(b);
		}
	});

	$("#lssp-modal-export").on("click", async function () {
		const buildings = await db.getAllElements();
		const modifiedBuildings = buildings.map((b) => b.getAllProperties());
		downloadObjectAsJson(
			modifiedBuildings,
			`LSS-Planner-${convertDate(new Date())}`
		);
	});

	$("#lssp-modal-delete").on("click", async function () {
		if (confirm("Wirklich alles Löschen?")) {
			const buildings = await db.getAllElements();
			await Promise.all(buildings.map((a) => db.deleteItemById(a.id)));
			logMessage("Alles Gelöscht");
			location.reload();
		} else {
			logMessage("Löschen Abgebrochen");
		}
	});

	$("#lssp-modal-import").on("click", function () {
		var filesInput: HTMLInputElement = document.getElementById(
			"lssp-modal-selectFiles"
		) as HTMLInputElement;
		var files: FileList = filesInput.files as FileList;
		var fr = new FileReader();

		fr.onload = function (e) {
			var result: any = JSON.parse(e.target?.result as string);
			let buildings: building[] = [];
			result.forEach((b: any) => {
				let bd = new building();
				bd.set(b);
				buildings.push(bd);
			});
			const output = document.getElementById("lssp-modal-body-output");
			if (output) {
				renderImportRows(output, buildings);
			}
			bindSaveImport(buildings, db);
		};

		fr.readAsText(files.item(0) as File);
	});

	$("#lssp-modal-export-notes").on("click", async function () {
		logMessage("Saving to Notes...");
		const buildings = await db.getAllElements();
		const modifiedBuildings = buildings.map((b) => b.getAllProperties());
		logMessage("Exporting notes", modifiedBuildings);

		let save = `${notesMarker.start}\n ${JSON.stringify(modifiedBuildings)}\n ${
			notesMarker.end
		}`;

		const div = document.createElement("div");
		mountTemplate(div, ExportNotesTemplate, { save });
		div.style.cssText = "background-color: black;";
		this.parentElement?.append(div);
	});

	$("#lssp-modal-import-notes").on("click", async function () {
		const notes = await getNotes();
		let start = notes.search(notesMarker.start);
		let end = notes.search(notesMarker.end);
		let data = notes.substring(start + notesMarker.start.length + 1, end);

		var result: any = JSON.parse(data);
		let buildings: building[] = [];
		result.forEach((b: any) => {
			let bd = new building();
			bd.set(b);
			buildings.push(bd);
		});
		const output = document.getElementById("lssp-modal-body-output");
		if (output) {
			renderImportRows(output, buildings);
		}
		bindSaveImport(buildings, db);
	});

	$("#lssp-modal-settings-hide-all").on("click", function () {
		const categories = AppDictionary.getCategories();
		const shouldShowAll = categories.every((category) =>
			isCategoryHidden(category)
		);
		for (const category of categories) {
			setCategoryVisibility(category, shouldShowAll);
		}
		syncCategorySettingsButtons();
	});
}
