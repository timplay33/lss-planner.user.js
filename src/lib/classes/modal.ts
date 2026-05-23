import { building } from "./building";
import { mountHtml, mountTemplate } from "../render";
import type { BuildingTypeOption } from "../../types/types";

export class Modal {
	public readonly name: string;
	protected readonly element: HTMLDivElement;
	private lastFocusedElement: HTMLElement | null = null;

	constructor(name: string, innerHTML: string) {
		this.name = name;
		this.element = document.createElement("div");
		this.element.className = "modal fade";
		this.element.id = name;
		this.element.setAttribute("tabindex", "-1");
		this.element.setAttribute("role", "dialog");
		this.element.setAttribute("aria-labelledby", `${name}-label`);
		this.element.setAttribute("aria-hidden", "true");
		this.element.style.zIndex = "5000";
		mountHtml(this.element, innerHTML);
		this.bindLifecycleEvents();
		document.body.appendChild(this.element);

		if (this.element.id == "lssp-modal") {
			if (sessionStorage.getItem("isRdHidden") == "true") {
				$("#lssp-modal-settings-hide-rd").html("zeigen");
			}
			if (sessionStorage.getItem("isFeuHidden") == "true") {
				$("#lssp-modal-settings-hide-feu").html("zeigen");
			}
			if (sessionStorage.getItem("isPolHidden") == "true") {
				$("#lssp-modal-settings-hide-pol").html("zeigen");
			}
			if (sessionStorage.getItem("isThwHidden") == "true") {
				$("#lssp-modal-settings-hide-thw").html("zeigen");
			}
			if (sessionStorage.getItem("isSchoolHidden") == "true") {
				$("#lssp-modal-settings-hide-school").html("zeigen");
			}
			if (sessionStorage.getItem("isOtherHidden") == "true") {
				$("#lssp-modal-settings-hide-other").html("zeigen");
			}
		}
	}

	private bindLifecycleEvents(): void {
		$(this.element).on("show.bs.modal", () => {
			this.element.setAttribute("aria-hidden", "false");
			this.element.setAttribute("aria-modal", "true");
		});

		$(this.element).on("hide.bs.modal", () => {
			this.restoreFocus();
		});

		$(this.element).on("hidden.bs.modal", () => {
			this.element.setAttribute("aria-hidden", "true");
			this.element.removeAttribute("aria-modal");
			this.lastFocusedElement = null;
		});
	}

	private restoreFocus(): void {
		const activeElement = document.activeElement as HTMLElement | null;
		if (!activeElement || !this.element.contains(activeElement)) {
			return;
		}

		if (this.lastFocusedElement && document.contains(this.lastFocusedElement)) {
			this.lastFocusedElement.focus();
			return;
		}

		if (!document.body.hasAttribute("tabindex")) {
			document.body.setAttribute("tabindex", "-1");
		}
		document.body.focus();
	}

	public close() {
		$(this.element).modal("hide");
	}

	public open() {
		const activeElement = document.activeElement as HTMLElement | null;
		this.lastFocusedElement = activeElement && !this.element.contains(activeElement)
			? activeElement
			: null;
		$(this.element).modal("show");
	}
}

type BuildingModalContent = {
	iconURL: string;
	name: string;
	typeName: string;
	leitstelleName: string;
	lat: string;
	lng: string;
};

export class BuildingModal extends Modal {
	private readonly bodyTemplate: (data: BuildingModalContent) => string;

	constructor(
		name: string,
		innerHTML: string,
		bodyTemplate: (data: BuildingModalContent) => string
	) {
		super(name, innerHTML);
		this.bodyTemplate = bodyTemplate;
	}

	public async openWithData(building: building): Promise<void> {
		sessionStorage.setItem(
			"active_building",
			JSON.stringify(building.getAllProperties())
		);
		const leitstellenName = await building.getLeitstellenName();
		const body = document.getElementById("lssp-building-modal-body-content");
		if (body) {
			mountTemplate(body, this.bodyTemplate, {
				iconURL: building.iconURL || "",
				name: building.name || "",
				typeName: building.typeName || "",
				leitstelleName: leitstellenName || "-",
				lat: Number.isFinite(building.lat) ? `${building.lat}` : "-",
				lng: Number.isFinite(building.lng) ? `${building.lng}` : "-",
			});
		}
		this.open();
	}
}

type SelectOption = {
	key: number;
	caption: string;
	selected?: boolean;
};

type SelectOptionGroup = {
	label: string;
	options: SelectOption[];
};

type BuildingEditModalContent = {
	name: string;
	groups: ReadonlyArray<SelectOptionGroup>;
	leitstellen: SelectOption[];
};

const germanCollator = new Intl.Collator("de", { sensitivity: "base" });

export class BuildingEditModal extends Modal {
	private readonly bodyTemplate: (data: BuildingEditModalContent) => string;
	private readonly buildingTypes: ReadonlyArray<BuildingTypeOption>;
	private readonly leitstellen: ReadonlyArray<{ key: number; caption: string }>;

	constructor(
		name: string,
		innerHTML: string,
		bodyTemplate: (data: BuildingEditModalContent) => string,
		buildingTypes: ReadonlyArray<BuildingTypeOption>,
		leitstellen: ReadonlyArray<{ key: number; caption: string }>
	) {
		super(name, innerHTML);
		this.bodyTemplate = bodyTemplate;
		this.buildingTypes = buildingTypes;
		this.leitstellen = leitstellen;
	}

	public openWithData(building: building): void {
		const body = document.getElementById("lssp-building-edit-modal-body");
		if (body) {
			mountTemplate(body, this.bodyTemplate, {
				name: building.name || "",
				groups: this.getBuildingTypeGroups(building.type),
				leitstellen: this.leitstellen.map((leitstelle) => ({
					key: leitstelle.key,
					caption: leitstelle.caption,
					selected: leitstelle.key === building.leitstelle,
				})),
			});
		}

		sessionStorage.setItem(
			"active_building",
			JSON.stringify(building.getAllProperties())
		);
		this.open();
	}

	private getBuildingTypeGroups(selectedType: number): SelectOptionGroup[] {
		const grouped = new Map<string, SelectOption[]>();

		for (const buildingType of this.buildingTypes) {
			const category = buildingType.category || "Sonstige";
			const options = grouped.get(category) ?? [];
			options.push({
				key: buildingType.key,
				caption: buildingType.caption,
				selected: buildingType.key === selectedType,
			});
			grouped.set(category, options);
		}

		return [...grouped.entries()]
			.sort(([categoryA], [categoryB]) =>
				germanCollator.compare(categoryA, categoryB)
			)
			.map(([label, options]) => ({
				label,
				options: [...options].sort((optionA, optionB) =>
					germanCollator.compare(optionA.caption, optionB.caption)
				),
			}));
	}
}
