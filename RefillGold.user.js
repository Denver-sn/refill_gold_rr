// ==UserScript==
// @name        RefillGoldScript
// @namespace   https://pablobls.tech/
// @match       *://m.rivalregions.com/
// @grant       none
// @version     0.0.1
// @author      Pablo
// @description just refills da gold
// @downloadURL
// ==/UserScript==

// Modificar por el id del estado del que eres MoE:
const myState = "3006";
// Tiempo desde la ultima recarga en horas ( por defecto 2 ):
const hours = 2;
// Limite de oro en tu región para que vuelva a recargar ( por defecto 250 ):
const threshold = 250;

var autoRefillInterval;
const timePassed = hours * 3600000;
$(document).ready(function () {
	window.addEventListener("popstate", listener);

	const pushUrl = (href) => {
		history.pushState({}, "", href);
		window.dispatchEvent(new Event("popstate"));
	};

	listener();
});

function refill_gold() {
	$.ajax({
		type: "POST",
		url: "/parliament/donew/42/0/0",
		data: { tmp_gov: "0", c: c_html },
		success: function (data) {
			console.log(data);
			if (data == "no 2") {
				localStorage.setItem("is_my_state", false);
				console.log("wrong state");
			} else if (data == "ok") {
				localStorage.setItem("last_refill", c());
				console.log("gold refilled");
			}
		},
	});
}

function listener() {
	if (location.href.includes("#work")) {
		workPage();
		console.log("#work");
	}
	if (location.href.includes("#main")) {
		mainPage();
		console.log("#main");
	}
	let lastRefill = localStorage.getItem("last_refill");
	if (
		JSON.parse(localStorage.getItem("is_my_state")) &&
		(lastRefill == null || c() - lastRefill > timePassed)
	) {
		refill_gold();
	}

	if (autoRefillInterval !== undefined) {
        clearInterval(autoRefillInterval);
        console.log('autoRefill is off');
        autoRefillInterval = undefined;
	}
}

function workPage() {
	var total = $("div.mob_box_inner.mob_box_5_clean.float_left.imp.tc> div.yellow.small_box").text();
	if (
		$(".mslide.yellow").html() < threshold &&
		JSON.parse(localStorage.getItem("is_my_state")) && total != "2500/2500"
	) {
		refill_gold();
	}
}

function mainPage() {
	var mainPageInterval = setInterval(function () {
		if ($("#mob_box_region_1").length && !$("#my_mob_box").length) {
			clearInterval(mainPageInterval);

			if (
				$("#mob_box_region_2")
					.attr("action")
					.replace("map/state_details/", "") == myState
			) {
				addMenu(true);
				$("#my_refill").click(refill_gold);
				$("#auto_refill").click(autoRefill);
				localStorage.setItem("is_my_state", true);
			} else {
				addMenu(false);
				localStorage.setItem("is_my_state", false);
			}
		}
	});
}

function addMenu(isOn) {
	let lastRefill = new Date(
		JSON.parse(localStorage.getItem("last_refill"))
	).toLocaleString();
	var buttonColor;
	var buttonText;
	if (isOn) {
		buttonColor = "link";
		buttonText = "Refill now";
		// autoRefillButton =
			// '<div id="auto_refill" class="button_green index_auto pointer mslide">AutoRefill (beta)</div>';
	} else {
		buttonColor = "white";
		buttonText = "Not your state";
		// autoRefillButton = "";
	}

	$(".mob_box.mob_box_region_s").append(
		'<div id="my_refill" class="button_' +
			buttonColor +
			' index_auto pointer mslide">' +
			buttonText +
			'</div><div class="tiny">Last refill: ' +
			lastRefill +
			" (state:" +
			myState +
			")<span class='addit_2'> Script by @pablo_rr</span></div>"
			// autoRefillButton +
			// "</div>"
	);
}

function autoRefill() {
    console.log('auto refill on');
    $('#auto_refill').removeClass('button_green').addClass('button_white');
	autoRefillInterval = setInterval(function () {
		refill_gold();
	}, timePassed);
}
