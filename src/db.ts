import { LsspBuilding } from "./types/types";

export function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(
			sessionStorage.getItem("dbName") || "LSS-Planner",
			3
		);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const objectStore = db.createObjectStore("buildings", {
				keyPath: "id",
				autoIncrement: true,
			});
			objectStore.createIndex("id", "id", { unique: true });
			objectStore.createIndex("name", "name", { unique: false });
			objectStore.createIndex("type", "type", { unique: false });
		};
	});
}

export function addData(
	db: IDBDatabase,
	building: LsspBuilding
): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["buildings"], "readwrite");
		const objectStore = transaction.objectStore("buildings");
		const request = objectStore.put(building);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve();
		};
	});
}
export function getElementById(
	db: IDBDatabase,
	id: number
): Promise<LsspBuilding> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["buildings"], "readonly");
		const objectStore = transaction.objectStore("buildings");
		const request = objectStore.get(id);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};
	});
}
export function getAllElements(db: IDBDatabase): Promise<LsspBuilding[]> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["buildings"], "readonly");
		const objectStore = transaction.objectStore("buildings");
		const request = objectStore.getAll();

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};
	});
}
export function deleteItemById(db: IDBDatabase, id: number): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["buildings"], "readwrite");
		const objectStore = transaction.objectStore("buildings");
		const request = objectStore.delete(id);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve();
		};
	});
}
