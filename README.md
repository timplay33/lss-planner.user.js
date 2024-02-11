# lss-planner.user.js

ist ein UserScript für das [Leitstellenspiel](https://leitstellenspiel.de), welches das Planen von Gebäuden ermöglicht.

## Wie funktioniert es ?

Das Script fügt einen Knopf auf die Benutzeroberfläche hinzu. Dieser Knopf fügt wie beim Bau von Gebäuden einen Marker hinzu, welcher frei beweglich ist. Ist die Position gewählt, kann der Marker gespeichert werden. Dieser wandelt sich dann in einen Gebäudemarker um, durch das Klicken auf den Marker kann dieser bearbeitet oder gelöscht werden. Die Marker werden in der IndexedDB direkt im Browser gespeichert und sind auch nach einem Neuladen der Seite weiterhin vorhanden.

## Warum ?

Die Idee hinter dem Script ist es, Gebäude, welche man sich noch nicht leisten kann oder noch nicht bauen möchte, planen zu können und diese so, wenn man sie dann doch bauen möchte, leichter bauen zu können.

## Überblick

- [x] Marker erstellen
- [x] Marker anzeigen
- [x] Maker speichern
- [x] Marker Typ auswählen
- [x] Gebäude Übersicht
- [x] Gebäude Namen
- [x] Gebäude Löschen
- [x] Gebäude Daten als Json speichern
- [x] Gebäude Daten aus Json auslesen
- [x] Ausgelesene Json Daten in DB speichern
- [x] Übersicht über alle Gebäude
- [x] Gebäude semi automatisch bauen
- [x] Gebäude Daten in Notizen speichern
- [x] Gebäude Daten aus Notizen auslesen

und mehr....

## Installation

Installiere [Tampermonkey](https://www.tampermonkey.net/)
und drücke auf den Link
[https://timplay33.github.io/lss-planner.user.js/lss-planner.user.js](https://timplay33.github.io/lss-planner.user.js/lss-planner.user.js)

## v0.5.0 : TypeScript

with version 0.5.0 the hole project has been restructured, the userscript file will now load a prebuilt js file, which is build with the webpack bundler. The source code is mostly written is TypeScript to give the project type safety. Each building is created with a Class and is saved with IndexedDB in the browser. The buildings may be exported to a JSON file in the main modal.
