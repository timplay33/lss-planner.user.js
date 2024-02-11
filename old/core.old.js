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
