import { building } from "./lib/classes/building";
import { LsspBuilding, LsspBuildingNoID } from "./types/types";

export class Database {
	private static singleton: Database | null = null;
	private static initPromise: Promise<Database> | null = null;
	private static readonly dbName = sessionStorage.getItem("dbName") || "LSS-Planner";
	private static readonly dbVersion = 3;
	private static readonly storeName = "buildings";

	private connection: IDBDatabase | null = null;

	private constructor() {
		// Prevent instantiation; use the static singleton API.
	}

	private static async openDatabase(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(Database.dbName, Database.dbVersion);

			request.onerror = () => {
				reject(request.error);
			};

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
				const db = (event.target as IDBOpenDBRequest).result;
				const objectStore = db.createObjectStore(Database.storeName, {
					keyPath: "id",
					autoIncrement: true,
				});
				objectStore.createIndex("id", "id", { unique: true });
				objectStore.createIndex("name", "name", { unique: false });
				objectStore.createIndex("type", "type", { unique: false });
			};
		});
	}

	public static async init(): Promise<Database> {
		if (Database.singleton) {
			return Database.singleton;
		}

		if (!Database.initPromise) {
			Database.initPromise = Database.openDatabase()
				.then((db) => {
					const database = new Database();
					database.connection = db;
					Database.singleton = database;
					return database;
				})
				.catch((error) => {
					Database.initPromise = null;
					throw error;
				});
		}

		return Database.initPromise;
	}

	public static getInstance(): Database {
		if (!Database.singleton) {
			throw new Error("Database has not been initialized. Call Database.init() first.");
		}

		return Database.singleton;
	}

	public static isInitialized(): boolean {
		return Database.singleton !== null;
	}

	private connectionOrThrow(): IDBDatabase {
		if (!this.connection) {
			throw new Error("Database has not been initialized. Call Database.init() first.");
		}

		return this.connection;
	}

	private getStore(mode: IDBTransactionMode): IDBObjectStore {
		return this.connectionOrThrow()
			.transaction([Database.storeName], mode)
			.objectStore(Database.storeName);
	}

	public addData(building: LsspBuilding | LsspBuildingNoID): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = this.getStore("readwrite").put(building);

			request.onerror = () => {
				reject(request.error);
			};

			request.onsuccess = () => {
				resolve();
			};
		});
	}

	public getElementById(id: number): Promise<building> {
		return new Promise((resolve, reject) => {
			const request = this.getStore("readonly").get(id);

			request.onerror = () => {
				reject(request.error);
			};

			request.onsuccess = () => {
				const b = new building();
				b.set(request.result);
				resolve(b);
			};
		});
	}

	public getAllElements(): Promise<building[]> {
		return new Promise((resolve, reject) => {
			const request = this.getStore("readonly").getAll();

			request.onerror = () => {
				reject(request.error);
			};

			request.onsuccess = () => {
				const buildings: building[] = [];
				request.result.forEach((d) => {
					const b = new building();
					b.set(d);
					buildings.push(b);
				});
				resolve(buildings);
			};
		});
	}

	public deleteItemById(id: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = this.getStore("readwrite").delete(id);

			request.onerror = () => {
				reject(request.error);
			};

			request.onsuccess = () => {
				resolve();
			};
		});
	}
}
