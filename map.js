var markers = {};
var icons = {};
const dictionary = {
	0: {
		icon: "/images/building_fire_other.png",
		caption: "Feuerwache",
	},
	1: {
		icon: "/images/building_fireschool_other.png",
		caption: "Feuerwehrschule",
	},
	2: {
		icon: "/images/building_rescue_station_other.png",
		caption: "Rettungswache",
	},
	3: {
		icon: "/images/building_rettungsschule_other.png",
		caption: "Rettungsschule",
	},
	4: {
		icon: "/images/building_hospital_other.png",
		caption: "Krankenhaus",
	},
	5: {
		icon: "/images/building_helipad_other.png",
		caption: "Rettungshubschrauber-Station",
	},
	6: {
		icon: "/images/building_polizeiwache_other.png",
		caption: "Polizeiwache",
	},
	7: {
		icon: "/images/building_leitstelle_other.png",
		caption: "Leitstelle",
	},
	8: {
		icon: "/images/building_polizeischule_other.png",
		caption: "Polizeischule",
	},
	9: {
		icon: "/images/building_thw_other.png",
		caption: "THW",
	},
	10: {
		icon: "/images/building_thw_school_other.png",
		caption: "THW Bundesschule",
	},
	11: {
		icon: "/images/building_bereitschaftspolizei_other.png",
		caption: "Bereitschaftspolizei",
	},
	12: {
		icon: "/images/building_seg_other.png",
		caption: "Schnelleinsatzgruppe (SEG)",
	},
	13: {
		icon: "/images/building_helipad_polizei_other.png",
		caption: "Polizeihubschrauberstation",
	},
	14: {
		icon: "/images/building_bereitstellungsraum_other.png",
		caption: "Bereitstellungsraum",
	},
	15: {
		icon: "/images/building_wasserwacht_other.png",
		caption: "Wasserrettung",
	},
	16: {
		icon: "/images/building_polizeiwache_other.png",
		caption: "Verbandszellen",
	},
	17: {
		icon: "/images/building_polizeisondereinheiten_other.png",
		caption: "Polizei-Sondereinheiten",
	},
	18: {
		icon: "/images/building_fire_other.png",
		caption: "Feuerwache (Kleinwache)",
	},
	19: {
		icon: "/images/building_polizeiwache_other.png",
		caption: "Polizeiwache (Kleinwache)",
	},
	20: {
		icon: "/images/building_rescue_station_other.png",
		caption: "Rettungswache (Kleinwache)",
	},
	21: {
		icon: "/images/building_rescue_station_other.png",
		caption: "Rettungshundestaffel",
	},
	22: {
		icon: "/images/building_complex_other.png",
		caption: "Großer Komplex",
	},
	23: {
		icon: "/images/building_complex_other.png",
		caption: "Kleiner Komplex",
	},
	24: {
		icon: "/images/building_police_horse_other.png",
		caption: "Reiterstaffel",
	},
};

////////////////////////////////////////////////////////////////
async function setBuildingMarker(building) {
	icons[building.id] = L.icon({
		iconUrl: dictionary[building.type].icon,
		iconSize: [32, 37],
		iconAnchor: [16, 37],
	});
	markers[building.id] = L.marker([building.lat, building.lng], {
		title: building.name,
		opacity: 0.6,
		icon: icons[building.id],
	})
		.on("click", () => openInfo(building))
		.addTo(map)
		.bindTooltip(building.name);
	markers[building.id]._icon.id = building.id;
}

function openInfo(building) {
	let modal = $(`#lssp-building-modal`);
	modal.modal("show");
	document
		.getElementById(`lssp-building-modal-form`)
		.setAttribute("data", JSON.stringify(building));
	let modal_title = document.getElementById("lssp-building-modal-body-title");
	modal_title.innerHTML = `${building.name}`;

	let modal_type = document.getElementById("lssp-building-modal-body-type");
	modal_type.innerHTML = `${dictionary[building.type].caption}`;

	let modal_lat = document.getElementById("lssp-building-modal-body-lat");
	modal_lat.innerHTML = `Latitude: ${building.lat}`;

	let modal_lng = document.getElementById("lssp-building-modal-body-lng");
	modal_lng.innerHTML = `Longitude: ${building.lng}`;

	let modal_leitstelle = document.getElementById(
		"lssp-building-modal-body-leitstelle"
	);
	$.getJSON("../api/buildings", function (data) {
		data = data.filter((l) => l.id == building.leitstelle);
		modal_leitstelle.innerHTML = `Leitstelle: ${data[0]?.caption || ""}`;
	});
}
