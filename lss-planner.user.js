// ==UserScript==
// @name         LSS-Planner
// @namespace    https://timplay33.github.io/lss-planner.user.js/
// @homepage     https://github.com/timplay33/lss-planner.user.js/
// @version      0.5.3
// @description  LSS-Planner
// @author       Tim Heidler git:@timplay33
// @match        https://www.leitstellenspiel.de/
// @icon         https://www.leitstellenspiel.de/favicon.ico
// @run-at       document-idle
// @grant        none
// ==/UserScript==

sessionStorage.setItem("scriptName", "LSS-Planner");
sessionStorage.setItem("dbName", "LSS-Planner");

(function () {
	const script = document.createElement("script");
	script.src = `https://timplay33.github.io/lss-planner.user.js/dist/core.js`;
	script.setAttribute("type", "module");
	script.setAttribute("async", "");
	document.head.append(script);
})();
