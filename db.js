const dbName = window.lssp.dbName || "LSS-Planner";

////////////////////////////////////////////////////////////////
function openDatabase() {
	return new Promise((resolve, reject) => {
		var request = indexedDB.open(dbName, 3);

		request.onsuccess = function (event) {
			var db = event.target.result;
			resolve(db);
		};

		request.onerror = function (event) {
			reject(new Error("Error opening database"));
		};

		request.onupgradeneeded = function (event) {
			var db = event.target.result;

			var objectStore = db.createObjectStore("buildings", {
				keyPath: "id",
				autoIncrement: true,
			});

			objectStore.createIndex("id", "id", { unique: true });
			objectStore.createIndex("name", "name", { unique: false });
			objectStore.createIndex("type", "type", { unique: false });
		};
	});
}

function addData(db, data) {
	return new Promise((resolve, reject) => {
		var transaction = db.transaction(["buildings"], "readwrite");
		var objectStore = transaction.objectStore("buildings");

		var request = objectStore.put(data);

		request.onsuccess = function (event) {
			resolve("Data added successfully");
		};

		request.onerror = function (event) {
			reject(new Error("Error adding data to the database"));
		};
	});
}
window.lssp.addData = addData;

function getElementById(db, objectId) {
	return new Promise((resolve, reject) => {
		var transaction = db.transaction(["buildings"], "readonly");
		var objectStore = transaction.objectStore("buildings");

		var request = objectStore.openCursor();

		request.onsuccess = function (event) {
			var cursor = event.target.result;

			if (cursor) {
				var item = cursor.value;

				if (item.id === objectId) {
					resolve(item);
				} else {
					cursor.continue();
				}
			} else {
				reject(new Error("Element not found in the database"));
			}
		};

		request.onerror = function (event) {
			reject(new Error("Error retrieving element from the database"));
		};
	});
}
window.lssp.getElementById = getElementById;

function getAllElements(db) {
	return new Promise((resolve, reject) => {
		var transaction = db.transaction(["buildings"], "readonly");
		var objectStore = transaction.objectStore("buildings");

		var elements = [];

		var request = objectStore.openCursor();

		request.onsuccess = function (event) {
			var cursor = event.target.result;

			if (cursor) {
				elements.push(cursor.value);
				cursor.continue();
			} else {
				resolve(elements);
			}
		};

		// Handle cursor error
		request.onerror = function (event) {
			reject(new Error("Error retrieving elements from the database"));
		};
	});
}
window.lssp.getAllElements = getAllElements;

function deleteElementById(db, objectId) {
	return new Promise((resolve, reject) => {
		var transaction = db.transaction(["buildings"], "readwrite");
		var objectStore = transaction.objectStore("buildings");

		var request = objectStore.delete(objectId);

		request.onsuccess = function (event) {
			resolve("Element deleted successfully");
		};

		request.onerror = function (event) {
			reject(new Error("Error deleting element from the database"));
		};
	});
}
window.lssp.deleteElementById = deleteElementById;
