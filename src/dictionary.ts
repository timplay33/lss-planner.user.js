import type {
	BuildingTypeOption,
	DictionaryEntry,
	DictionaryMap,
} from "./types/types";
import * as dictionaryImport from "./public/dictionary.json";

function isBuildingTypeKey(key: string): boolean {
	return /^\d+$/.test(key);
}

export enum IconVariant {
	MAP = "map",
	MENU = "menu",
}

export class AppDictionary {
	private static instance: DictionaryMap | null = null;
	private static entriesCache: ReadonlyArray<BuildingTypeOption> = [];
	private static entryByType = new Map<number, DictionaryEntry>();

	private constructor() {
		// Singleton service; use the static API.
	}

	public static init(dictionary: DictionaryMap): void {
		const entries = Object.entries(dictionary).filter(([key]) =>
			isBuildingTypeKey(key)
		);

		AppDictionary.instance = dictionary;
		AppDictionary.entryByType = new Map(
			entries.map(([key, value]) => [Number(key), value])
		);
		AppDictionary.entriesCache = entries.map(([key, value]) => ({
			key: Number(key),
			caption: value.caption,
			category: value.category,
		}));
	}

	public static isInitialized(): boolean {
		return AppDictionary.instance !== null;
	}

	public static has(type: number): boolean {
		return AppDictionary.entryByType.has(type);
	}

	public static getEntry(type: number): DictionaryEntry | undefined {
		return AppDictionary.entryByType.get(type);
	}

	public static getCaption(type: number): string {
		return AppDictionary.getEntry(type)?.caption ?? "";
	}

	public static getIcon(
		type: number,
		variant: IconVariant = IconVariant.MENU
	): string {
		const iconId = AppDictionary.getEntry(type)?.icon;
		if (!iconId) return "";
		const suffix = variant === IconVariant.MAP ? "_other" : "";
		return `/images/${iconId}${suffix}.png`;
	}

	public static getCategory(type: number): string {
		return AppDictionary.getEntry(type)?.category ?? "Sonstige";
	}

	public static getBuildingTypeOptions(): ReadonlyArray<BuildingTypeOption> {
		return AppDictionary.entriesCache;
	}

	public static getBuildingTypes(): ReadonlyArray<BuildingTypeOption> {
		return AppDictionary.getBuildingTypeOptions();
	}

	public static getCategories(): ReadonlyArray<string> {
		return [
			...new Set(
				AppDictionary.entriesCache.map((entry) => entry.category || "Sonstige")
			),
		]
			.sort((categoryA, categoryB) =>
				categoryA.localeCompare(categoryB, "de", { sensitivity: "base" })
			);
	}
}

AppDictionary.init(dictionaryImport);
