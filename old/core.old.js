async function buildBuilding(building) {
	let modal = $(`#lssp-building-modal`);
	modal.modal("hide");
	document.getElementById("build_new_building").click();
	await sleep(500);
	$("#building_building_type").val(building.type);
	$("#building_name").val(building.name);
	building_new_marker.setLatLng(L.latLng(building.lat, building.lng));
	building_new_dragend();
	$("#building_leitstelle_building_id").val(building.leitstelle);
	$("#new_building").on("submit", function () {
		logMessage("Build: " + building.name);
		deleteElementById(window.lssp.db, building.id);
	});
}

// Save to Notes Feature
var stringToHTML = function (str) {
	var dom = document.createElement("div");
	dom.innerHTML = str;
	return dom;
};
async function getNotes() {
	res = await $.get("https://www.leitstellenspiel.de/note");
	html = stringToHTML(res);
	return html.querySelector("textarea").innerHTML;
}
async function getToken() {
	res = await $.get("https://www.leitstellenspiel.de/note");
	html = stringToHTML(res);
	return html.querySelectorAll("input")[2].getAttribute("value");
}
function searchBackUpData(notes) {
	let start = notes.search(notesMarker.start);
	let end = notes.search(notesMarker.end);
	return notes.substring(start + notesMarker.start.length + 1, end);
}
async function saveToNotes(text, token) {
	let note = await getNotes();
	let start = note.search(notesMarker.start);
	let end = note.search(notesMarker.end);
	if (start != -1 || end != -1) {
		note = note.substring(0, start - 2);
	}
	let save = `${note}\n ${notesMarker.start}\n ${text}\n ${notesMarker.end}`;

	fetch("https://www.leitstellenspiel.de/note", {
		headers: {
			accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
			"cache-control": "max-age=0",
			"content-type": "application/x-www-form-urlencoded",
			"sec-ch-ua":
				'"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			"sec-fetch-dest": "iframe",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "same-origin",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
		},
		referrer: "https://www.leitstellenspiel.de/note",
		referrerPolicy: "strict-origin-when-cross-origin",
		body: `utf8=%E2%9C%93&_method=put&authenticity_token=${token}&note[message]=${save}&commit=Speichern`,
		method: "POST",
		mode: "cors",
		credentials: "include",
	});
}

// Download OBJECT as JSON
function downloadObjectAsJson(exportObj, exportName) {
	var dataStr =
		"data:text/json;charset=utf-8," +
		encodeURIComponent(JSON.stringify(exportObj));
	var downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName + ".json");
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

// Download Building Data as Json
$("#lssp-modal-export").on("click", async function () {
	downloadObjectAsJson(await getAllElements(window.lssp.db), "LSS-Planner");
});

// Export Building Data to Notes
$("#lssp-modal-export-notes").on("click", async function () {
	if (confirm("Wirklich alles Löschen?")) {
		const json = await getAllElements(window.lssp.db);
		const note = JSON.stringify(json);
		const token = await getToken();
		saveToNotes(note, token);
		logMessage("in Notizen gespeichert: \n" + note);
	} else {
		logMessage("in Notizen speichern abgebrochen");
	}
});

// Delete all Buildings from database
$("#lssp-modal-delete").on("click", async function () {
	if (confirm("Wirklich alles Löschen?")) {
		await getAllElements(window.lssp.db).then((b) => {
			b.forEach((a) => deleteElementById(window.lssp.db, a.id));
			logMessage("Alles Gelöscht");
		});
	} else {
		logMessage("Löschen Abgebrochen");
	}
});

// Import From JSON to Database
document.getElementById("lssp-modal-import").onclick = function () {
	var files = document.getElementById("lssp-modal-selectFiles").files;
	if (files.length <= 0) {
		return false;
	}

	var fr = new FileReader();

	fr.onload = function (e) {
		var result = JSON.parse(e.target.result);
		result.forEach((b) => {
			$("#lssp-modal-body-output").append(`
					<tr>
					<td ><img src="${dictionary[b.type].icon}" alt="icon ${
				dictionary[b.type].caption
			}"></td>
					<td >${b.name}</td>
					<td >${dictionary[b.type].caption}</td>
				</tr>`);
		});
		$("#lssp-modal-import-save").on("click", function () {
			result.forEach((b) => {
				addData(window.lssp.db, b);
				location.reload();
			});
		});
	};

	fr.readAsText(files.item(0));
};

// Import From Notes to Database
$("#lssp-modal-import-notes").on("click", async function () {
	const notes = searchBackUpData(await getNotes());
	const json = JSON.parse(notes);
	json.forEach((b) => {
		$("#lssp-modal-body-output").append(`
				<tr>
				<td ><img src="${dictionary[b.type].icon}" alt="icon ${
			dictionary[b.type].caption
		}"></td>
				<td >${b.name}</td>
				<td >${dictionary[b.type].caption}</td>
			</tr>`);
	});
	$("#lssp-modal-import-save").on("click", function () {
		json.forEach((b) => {
			addData(window.lssp.db, b);
			location.reload();
		});
	});
});
