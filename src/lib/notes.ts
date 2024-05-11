//notes
export const notesMarker = {
	start: "LSS-Planner Backup START: Do not modify",
	end: "LSS-Planner Backup END",
};

//export async function getToken() {
//	let res = await $.get("https://www.leitstellenspiel.de/note");
//	let html = stringToHTML(res);
//	return html.querySelectorAll("input")[2].getAttribute("value");
//}

var stringToHTML = function (str: string) {
	var dom = document.createElement("div");
	dom.innerHTML = str;
	return dom;
};

export async function getNotes() {
	let res = await $.get("https://www.leitstellenspiel.de/note");
	let html = stringToHTML(res);
	return html.querySelector("textarea")?.innerHTML || "";
}

//export async function saveToNotes(text: string, token: string) {
//	let note = await getNotes();
//	let start = note.search(notesMarker.start);
//	let end = note.search(notesMarker.end);
//	if (start != -1 || end != -1) {
//		note = note.substring(0, start - 2);
//	}
//	let save = `${note}\n ${notesMarker.start}\n ${text}\n ${notesMarker.end}`;
//
//	fetch("https://www.leitstellenspiel.de/note", {
//		headers: {
//			accept:
//				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//			"accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
//			"cache-control": "max-age=0",
//			"content-type": "application/x-www-form-urlencoded",
//			"sec-ch-ua":
//				'"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
//			"sec-ch-ua-mobile": "?0",
//			"sec-ch-ua-platform": '"Windows"',
//			"sec-fetch-dest": "iframe",
//			"sec-fetch-mode": "navigate",
//			"sec-fetch-site": "same-origin",
//			"sec-fetch-user": "?1",
//			"upgrade-insecure-requests": "1",
//		},
//		referrer: "https://www.leitstellenspiel.de/note",
//		referrerPolicy: "strict-origin-when-cross-origin",
//		body: `utf8=%E2%9C%93&_method=put&authenticity_token=${token}&note[message]=${save}&commit=Speichern`,
//		method: "POST",
//		mode: "cors",
//		credentials: "include",
//	});
//}
