//notes
export const notesMarker = {
	start: "LSS-Planner Backup START: Do not modify",
	end: "LSS-Planner Backup END",
};

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
