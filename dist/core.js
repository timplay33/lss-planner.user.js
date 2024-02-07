/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("var _public_dictionary_json__WEBPACK_IMPORTED_MODULE_1___namespace_cache;\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ \"./src/db.ts\");\n/* harmony import */ var _public_dictionary_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./public/dictionary.json */ \"./src/public/dictionary.json\");\n/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib */ \"./src/lib/index.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\n\nconst dictionary = /*#__PURE__*/ (_public_dictionary_json__WEBPACK_IMPORTED_MODULE_1___namespace_cache || (_public_dictionary_json__WEBPACK_IMPORTED_MODULE_1___namespace_cache = __webpack_require__.t(_public_dictionary_json__WEBPACK_IMPORTED_MODULE_1__, 2)));\nfunction main() {\n    return __awaiter(this, void 0, void 0, function* () {\n        (0,_lib__WEBPACK_IMPORTED_MODULE_2__.logMessage)(\"Starting...\");\n        (0,_lib__WEBPACK_IMPORTED_MODULE_2__.addModals)();\n        const db = yield (0,_db__WEBPACK_IMPORTED_MODULE_0__.openDatabase)();\n        console.log(yield (0,_db__WEBPACK_IMPORTED_MODULE_0__.getAllElements)(db));\n    });\n}\nmain();\n\n\n//# sourceURL=webpack:///./src/core.ts?");

/***/ }),

/***/ "./src/db.ts":
/*!*******************!*\
  !*** ./src/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addData: () => (/* binding */ addData),\n/* harmony export */   deleteItemById: () => (/* binding */ deleteItemById),\n/* harmony export */   getAllElements: () => (/* binding */ getAllElements),\n/* harmony export */   getElementById: () => (/* binding */ getElementById),\n/* harmony export */   openDatabase: () => (/* binding */ openDatabase)\n/* harmony export */ });\nfunction openDatabase() {\n    return new Promise((resolve, reject) => {\n        const request = indexedDB.open(sessionStorage.getItem(\"dbName\") || \"LSS-Planner\", 3);\n        request.onerror = () => {\n            reject(request.error);\n        };\n        request.onsuccess = () => {\n            resolve(request.result);\n        };\n        request.onupgradeneeded = (event) => {\n            const db = event.target.result;\n            const objectStore = db.createObjectStore(\"buildings\", {\n                keyPath: \"id\",\n                autoIncrement: true,\n            });\n            objectStore.createIndex(\"id\", \"id\", { unique: true });\n            objectStore.createIndex(\"name\", \"name\", { unique: false });\n            objectStore.createIndex(\"type\", \"type\", { unique: false });\n        };\n    });\n}\nfunction addData(db, building) {\n    return new Promise((resolve, reject) => {\n        const transaction = db.transaction([\"buildings\"], \"readwrite\");\n        const objectStore = transaction.objectStore(\"buildings\");\n        const request = objectStore.put(building);\n        request.onerror = () => {\n            reject(request.error);\n        };\n        request.onsuccess = () => {\n            resolve();\n        };\n    });\n}\nfunction getElementById(db, id) {\n    return new Promise((resolve, reject) => {\n        const transaction = db.transaction([\"buildings\"], \"readonly\");\n        const objectStore = transaction.objectStore(\"buildings\");\n        const request = objectStore.get(id);\n        request.onerror = () => {\n            reject(request.error);\n        };\n        request.onsuccess = () => {\n            resolve(request.result);\n        };\n    });\n}\nfunction getAllElements(db) {\n    return new Promise((resolve, reject) => {\n        const transaction = db.transaction([\"buildings\"], \"readonly\");\n        const objectStore = transaction.objectStore(\"buildings\");\n        const request = objectStore.getAll();\n        request.onerror = () => {\n            reject(request.error);\n        };\n        request.onsuccess = () => {\n            resolve(request.result);\n        };\n    });\n}\nfunction deleteItemById(db, id) {\n    return new Promise((resolve, reject) => {\n        const transaction = db.transaction([\"buildings\"], \"readwrite\");\n        const objectStore = transaction.objectStore(\"buildings\");\n        const request = objectStore.delete(id);\n        request.onerror = () => {\n            reject(request.error);\n        };\n        request.onsuccess = () => {\n            resolve();\n        };\n    });\n}\n\n\n//# sourceURL=webpack:///./src/db.ts?");

/***/ }),

/***/ "./src/lib/index.ts":
/*!**************************!*\
  !*** ./src/lib/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addModals: () => (/* binding */ addModals),\n/* harmony export */   logMessage: () => (/* binding */ logMessage),\n/* harmony export */   sleep: () => (/* binding */ sleep)\n/* harmony export */ });\n/* harmony import */ var _modals_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modals/modal */ \"./src/modals/modal.ts\");\n/* harmony import */ var _modals_buildingEditModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../modals/buildingEditModal */ \"./src/modals/buildingEditModal.ts\");\n/* harmony import */ var _modals_buildingModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../modals/buildingModal */ \"./src/modals/buildingModal.ts\");\n/* harmony import */ var _modals_mainModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../modals/mainModal */ \"./src/modals/mainModal.ts\");\n\nfunction logMessage(message) {\n    console.log(`[${sessionStorage.getItem(\"scriptName\") || \"LSS-Planner\"}]: ` + message);\n}\nfunction sleep(ms) {\n    return new Promise((resolve) => setTimeout(resolve, ms));\n}\n\n\n\nfunction addModals() {\n    const main = new _modals_modal__WEBPACK_IMPORTED_MODULE_0__.Modal(`lssp-modal`, _modals_mainModal__WEBPACK_IMPORTED_MODULE_3__.MainModalString);\n    const building = new _modals_modal__WEBPACK_IMPORTED_MODULE_0__.Modal(`lssp-building-modal`, _modals_buildingModal__WEBPACK_IMPORTED_MODULE_2__.BuildingModalString);\n    const edit = new _modals_modal__WEBPACK_IMPORTED_MODULE_0__.Modal(`lssp-building-edit-modal`, _modals_buildingEditModal__WEBPACK_IMPORTED_MODULE_1__.BuildingEditModalString, true);\n    console.log(main);\n}\n\n\n//# sourceURL=webpack:///./src/lib/index.ts?");

/***/ }),

/***/ "./src/modals/buildingEditModal.ts":
/*!*****************************************!*\
  !*** ./src/modals/buildingEditModal.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BuildingEditModalString: () => (/* binding */ BuildingEditModalString)\n/* harmony export */ });\nconst BuildingEditModalString = `\n<div class=\"modal-dialog modal-lg\" role=\"document\" style=\"width: 95%; margin: 40px auto\">\n    <div class=\"modal-content\" action=\"\">\n        <div class=\"modal-header\">\n            <h1 class=\"modal-title\" id=\"lssp-building-edit-modal-label\">LSS-Planner</h1>\n            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n        <form id=\"lssp-building-edit-modal-form\">\n            <div id=\"lssp-building-edit-modal-body\" class=\"modal-body\"\n                style=\"height: calc(100vh - 350px); overflow-y: auto\">\n                <div class=\"col-md-12 col-xs-12\">\n                    <div id=\"building_name_step\">\n                        <div class=\"input-group string required building_name\">\n                            <div class=\"input-group-addon\">\n                                <label class=\"string required\" for=\"building_name\"><abbr title=\"required\">*</abbr>\n                                    Name</label>\n                            </div>\n                            <input class=\"string required form-control\" id=\"lssp-building-modal-building-name\"\n                                maxlength=\"40\" name=\"building[name]\" size=\"50\" type=\"text\" control-id=\"ControlID-14\" />\n                        </div>\n                    </div>\n                    <div class=\"input-group select required building_building_type\">\n                        <div class=\"input-group-addon\">\n                            <label class=\"integer required select required\"\n                                for=\"lssp-building-modal-building-type\"><abbr title=\"required\">*</abbr>\n                                Gebäudetyp</label>\n                        </div>\n\n                        <select class=\"select required form-control\" id=\"lssp-building-modal-building-type\"\n                            name=\"building[building_type]\">\n                            <option value=\"\"></option>\n                            <option value=\"7\">Leitstelle</option>\n                            <option value=\"0\">Feuerwache</option>\n                            <option value=\"18\">Feuerwache (Kleinwache)</option>\n                            <option value=\"1\">Feuerwehrschule</option>\n                            <option value=\"2\">Rettungswache</option>\n                            <option value=\"20\">Rettungswache (Kleinwache)</option>\n                            <option value=\"3\">Rettungsschule</option>\n                            <option value=\"4\">Krankenhaus</option>\n                            <option value=\"5\">Rettungshubschrauber-Station</option>\n                            <option value=\"12\">Schnelleinsatzgruppe (SEG)</option>\n                            <option value=\"6\">Polizeiwache</option>\n                            <option value=\"19\">Polizeiwache (Kleinwache)</option>\n                            <option value=\"11\">Bereitschaftspolizei</option>\n                            <option value=\"17\">Polizei-Sondereinheiten</option>\n                            <option value=\"24\">Reiterstaffel</option>\n                            <option value=\"13\">Polizeihubschrauberstation</option>\n                            <option value=\"8\">Polizeischule</option>\n                            <option value=\"9\">THW</option>\n                            <option value=\"10\">THW Bundesschule</option>\n                            <option value=\"14\">Bereitstellungsraum</option>\n                            <option value=\"15\">Wasserrettung</option>\n                            <option value=\"21\">Rettungshundestaffel</option>\n                        </select>\n                    </div>\n                    <div class=\"input-group select required building_building_type\">\n                        <div class=\"input-group-addon\">\n                            <label class=\"integer optional select required\"\n                                for=\"lssp-building-modal-building-leitstelle\">Zugeordnete Leitstelle</label>\n                        </div>\n                        <select class=\"select required form-control\" id=\"lssp-building-modal-building-leitstelle\"\n                            name=\"building[building_type]\">\n                            <option value=\"\"></option>\n                        </select>\n                    </div>\n                </div>\n                <button type=\"submit\" id=\"lssp-building-edit-modal-form-submit\" class=\"btn btn-default\">\n                    Speichern\n                </button>\n            </div>\n        </form>\n    </div>\n</div>`;\n\n\n//# sourceURL=webpack:///./src/modals/buildingEditModal.ts?");

/***/ }),

/***/ "./src/modals/buildingModal.ts":
/*!*************************************!*\
  !*** ./src/modals/buildingModal.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BuildingModalString: () => (/* binding */ BuildingModalString)\n/* harmony export */ });\nconst BuildingModalString = `<div class=\"modal-dialog modal-lg\" role=\"document\" style=\"width: 95%; margin: 40px auto\">\n<div class=\"modal-content\" action=\"\">\n    <div class=\"modal-header\">\n        <h1 class=\"modal-title\" id=\"lssp-building-modal-label\">LSS-Planner</h1>\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n    </div>\n    <form id=\"lssp-building-modal-form\">\n        <div id=\"lssp-building-modal-body\" class=\"modal-body\" style=\"height: calc(100vh - 350px); overflow-y: auto\">\n            <div>\n                <h1 id=\"lssp-building-modal-body-title\"></h1>\n                <p id=\"lssp-building-modal-body-type\"></p>\n            </div>\n            <p id=\"lssp-building-modal-body-leitstelle\">Leitstelle:</p>\n            <p id=\"lssp-building-modal-body-lat\">Latitude:</p>\n            <p id=\"lssp-building-modal-body-lng\">Longitude:</p>\n            <button type=\"submit\" id=\"lssp-building-modal-form-build\" class=\"btn btn-success\">Bauen</button>\n            <button type=\"submit\" id=\"lssp-building-modal-form-submit\" class=\"btn btn-default\">Bearbeiten</button>\n            <button type=\"submit\" id=\"lssp-building-modal-form-delete\" data-confirm=\"Wirklich Löschen?\"\n                data-method=\"delete\" class=\"btn btn-danger\">Löschen</button>\n        </div>\n    </form>\n</div>\n</div>`;\n\n\n//# sourceURL=webpack:///./src/modals/buildingModal.ts?");

/***/ }),

/***/ "./src/modals/mainModal.ts":
/*!*********************************!*\
  !*** ./src/modals/mainModal.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MainModalString: () => (/* binding */ MainModalString)\n/* harmony export */ });\nconst MainModalString = `<div\n    class=\"modal-dialog modal-lg\"\n    role=\"document\"\n    style=\"width: 95%; margin: 40px auto\"\n>\n    <div class=\"modal-content\" action=\"\">\n        <div class=\"modal-header\">\n            <h1 class=\"modal-title\" id=\"lssp-modal-label\">LSS-Planner</h1>\n            <button\n                type=\"button\"\n                class=\"close\"\n                data-dismiss=\"modal\"\n                aria-label=\"Close\"\n            >\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n        <div\n            id=\"lssp-modal-body\"\n            class=\"modal-body\"\n            style=\"height: calc(100vh - 350px); overflow-y: auto\"\n        >\n            <div>\n                <ul class=\"nav nav-tabs\" role=\"tablist\" style=\"margin-bottom: 10px\">\n                    <li role=\"presentation\" class=\"active\">\n                        <a\n                            href=\"#lssp-modal-dash-panel\"\n                            aria-controls=\"lssp-modal-dash-panel\"\n                            role=\"tab\"\n                            data-toggle=\"tab\"\n                        >\n                            Übersicht\n                        </a>\n                    </li>\n                    <li role=\"presentation\">\n                        <a\n                            href=\"#lssp-modal-backup-panel\"\n                            aria-controls=\"lssp-modal-backup-panel\"\n                            role=\"tab\"\n                            data-toggle=\"tab\"\n                        >\n                            BackUp\n                        </a>\n                    </li>\n                </ul>\n                <div class=\"tab-content\">\n                    <div\n                        role=\"tabpanel\"\n                        class=\"tab-pane active\"\n                        id=\"lssp-modal-dash-panel\"\n                    >\n                        <table\n                            id=\"lssp-modal-dash-table\"\n                            class=\"table table-striped tablesorter tablesorter-default\"\n                            role=\"grid\"\n                        >\n                            <thead>\n                                <tr class=\"tablesorter-headerRow\" role=\"row\">\n                                    <th></th>\n                                    <th>Name</th>\n                                    <th>Typ</th>\n                                </tr>\n                            </thead>\n                            <tbody\n                                id=\"lssp-modal-dash-table-body\"\n                                aria-live=\"polite\"\n                                aria-relevant=\"all\"\n                            ></tbody>\n                        </table>\n                    </div>\n                    <div role=\"tabpanel\" class=\"tab-pane\" id=\"lssp-modal-backup-panel\">\n                        <div>\n                            <h2>JSON-Datei</h2>\n                            <input\n                                type=\"file\"\n                                id=\"lssp-modal-selectFiles\"\n                                value=\"Import\"\n                            /><br />\n                            <button id=\"lssp-modal-import\" class=\"btn btn-default\">\n                                Importieren\n                            </button>\n                            <button id=\"lssp-modal-export\" class=\"btn btn-success\">\n                                Herunterladen\n                            </button>\n                        </div>\n                        <div>\n                            <h2>Notizen</h2>\n                            <button id=\"lssp-modal-export-notes\" class=\"btn btn-success\">\n                                in Notizen Exportieren\n                            </button>\n                            <button id=\"lssp-modal-import-notes\" class=\"btn btn-success\">\n                                aus Notizen Importieren\n                            </button>\n                        </div>\n                        <div>\n                            <h2>Zu Importierende Daten</h2>\n\n                            <table\n                                class=\"table table-striped tablesorter tablesorter-default\"\n                            >\n                                <thead>\n                                    <tr class=\"tablesorter-headerRow\" role=\"row\">\n                                        <th></th>\n                                        <th>Name</th>\n                                        <th>Typ</th>\n                                    </tr>\n                                </thead>\n                                <tbody id=\"lssp-modal-body-output\"></tbody>\n                            </table>\n                            <button\n                                id=\"lssp-modal-import-save\"\n                                class=\"btn btn-success\"\n                                type=\"button\"\n                            >\n                                Speichern\n                            </button>\n                            <button id=\"lssp-modal-delete\" class=\"btn btn-danger\">\n                                Alles Löschen\n                            </button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n`;\n\n\n//# sourceURL=webpack:///./src/modals/mainModal.ts?");

/***/ }),

/***/ "./src/modals/modal.ts":
/*!*****************************!*\
  !*** ./src/modals/modal.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Modal: () => (/* binding */ Modal)\n/* harmony export */ });\nclass Modal {\n    constructor(name, innerHTML, addLeitstellenSelect = false) {\n        const modal = document.createElement(\"div\");\n        modal.className = \"modal fade\";\n        modal.id = name;\n        modal.setAttribute(\"tabindex\", \"-1\");\n        modal.setAttribute(\"role\", \"dialog\");\n        modal.setAttribute(\"aria-labelledby\", \"lssp-modal-label\");\n        modal.setAttribute(\"aria-hidden\", \"true\");\n        modal.style.zIndex = \"5000\";\n        modal.innerHTML = innerHTML;\n        document.body.appendChild(modal);\n        if (addLeitstellenSelect) {\n            $.getJSON(\"../api/buildings\", function (data) {\n                data = data.filter((leitstelle) => leitstelle.building_type == 7);\n                data.forEach((leitstelle) => {\n                    $(\"#lssp-building-modal-building-leitstelle\").append(`<option value=\"${leitstelle.id}\">${leitstelle.caption}</option>`);\n                });\n            });\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/modals/modal.ts?");

/***/ }),

/***/ "./src/public/dictionary.json":
/*!************************************!*\
  !*** ./src/public/dictionary.json ***!
  \************************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('{\"0\":{\"icon\":\"/images/building_fire_other.png\",\"caption\":\"Feuerwache\"},\"1\":{\"icon\":\"/images/building_fireschool_other.png\",\"caption\":\"Feuerwehrschule\"},\"2\":{\"icon\":\"/images/building_rescue_station_other.png\",\"caption\":\"Rettungswache\"},\"3\":{\"icon\":\"/images/building_rettungsschule_other.png\",\"caption\":\"Rettungsschule\"},\"4\":{\"icon\":\"/images/building_hospital_other.png\",\"caption\":\"Krankenhaus\"},\"5\":{\"icon\":\"/images/building_helipad_other.png\",\"caption\":\"Rettungshubschrauber-Station\"},\"6\":{\"icon\":\"/images/building_polizeiwache_other.png\",\"caption\":\"Polizeiwache\"},\"7\":{\"icon\":\"/images/building_leitstelle_other.png\",\"caption\":\"Leitstelle\"},\"8\":{\"icon\":\"/images/building_polizeischule_other.png\",\"caption\":\"Polizeischule\"},\"9\":{\"icon\":\"/images/building_thw_other.png\",\"caption\":\"THW\"},\"10\":{\"icon\":\"/images/building_thw_school_other.png\",\"caption\":\"THW Bundesschule\"},\"11\":{\"icon\":\"/images/building_bereitschaftspolizei_other.png\",\"caption\":\"Bereitschaftspolizei\"},\"12\":{\"icon\":\"/images/building_seg_other.png\",\"caption\":\"Schnelleinsatzgruppe (SEG)\"},\"13\":{\"icon\":\"/images/building_helipad_polizei_other.png\",\"caption\":\"Polizeihubschrauberstation\"},\"14\":{\"icon\":\"/images/building_bereitstellungsraum_other.png\",\"caption\":\"Bereitstellungsraum\"},\"15\":{\"icon\":\"/images/building_wasserwacht_other.png\",\"caption\":\"Wasserrettung\"},\"16\":{\"icon\":\"/images/building_polizeiwache_other.png\",\"caption\":\"Verbandszellen\"},\"17\":{\"icon\":\"/images/building_polizeisondereinheiten_other.png\",\"caption\":\"Polizei-Sondereinheiten\"},\"18\":{\"icon\":\"/images/building_fire_other.png\",\"caption\":\"Feuerwache (Kleinwache)\"},\"19\":{\"icon\":\"/images/building_polizeiwache_other.png\",\"caption\":\"Polizeiwache (Kleinwache)\"},\"20\":{\"icon\":\"/images/building_rescue_station_other.png\",\"caption\":\"Rettungswache (Kleinwache)\"},\"21\":{\"icon\":\"/images/building_rescue_station_other.png\",\"caption\":\"Rettungshundestaffel\"},\"22\":{\"icon\":\"/images/building_complex_other.png\",\"caption\":\"Großer Komplex\"},\"23\":{\"icon\":\"/images/building_complex_other.png\",\"caption\":\"Kleiner Komplex\"},\"24\":{\"icon\":\"/images/building_police_horse_other.png\",\"caption\":\"Reiterstaffel\"}}');\n\n//# sourceURL=webpack:///./src/public/dictionary.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/core.ts");
/******/ 	
/******/ })()
;