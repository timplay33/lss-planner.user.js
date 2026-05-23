// ==UserScript==
// @name         LSS-Planner DEV Helper
// @namespace    https://timplay33.github.io/lss-planner.user.js/
// @homepage     https://github.com/timplay33/lss-planner.user.js/
// @version      dev
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
	script.src = `http://127.0.0.1:5500/dist/core.js`;
	script.setAttribute("type", "module");
	script.setAttribute("async", "");
	document.head.append(script);
})();
