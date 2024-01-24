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
- [x] Gebäude daten als Json speichern
- [x] Gebäude daten aus Json auslesen
- [x] Übersicht über alle Gebäude
- [ ] Gebäude automatisch bauen

und mehr....

## Installation

Installiere [Tampermonkey](https://www.tampermonkey.net/)
und drücke auf den Link
https://github.com/timplay33/lss-planner.user.js/raw/main/lss-planner.user.js
