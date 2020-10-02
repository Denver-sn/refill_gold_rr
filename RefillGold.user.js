// ==UserScript==
// @name        RefillGoldScript
// @namespace   https://pablobls.tech/
// @match       *://m.rivalregions.com/
// @grant       none
// @version     0.0.1
// @author      Pablo
// @description just refills de gold
// @downloadURL   
// ==/UserScript==


// Modificar por el id del estado del que eres MoE:
const myState = "3006";
// Tiempo desde la ultima recarga en ms ( por defecto 2 horas = 3600000*2 ):
const timePassed = 3600000*2;
// Limite de oro en tu región para que vuelva a recargar ( por defecto 200 ):
const threshold = 200;

$(document).ready(function(){
    window.addEventListener('popstate', listener);

    const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
    };

    listener();
})

function refill_gold(){
    $.ajax({
        type: "POST", 
        url: '/parliament/donew/42/0/0',
        data: {tmp_gov: '0', c : c_html},
        success: function(data) {
            console.log(data);
            if (data == "no 2"){
                localStorage.setItem("is_my_state", false);
                console.log('wrong state');
            } else if (data == 'ok'){
                localStorage.setItem("last_refill", c());
                console.log('gold refilled')
            }
        }
    });
}


function listener(){
    if(location.href.includes('#work')){
        workPage();
        console.log('#work');
    }
    if(location.href.includes('#main')){
        mainPage();
        console.log('#main');

        
    }
    let lastRefill = localStorage.getItem("last_refill");
    if (JSON.parse(localStorage.getItem('is_my_state')) && (lastRefill ==  null || c() - lastRefill > timePassed)){
        refill_gold();
}
}

function workPage(){
    if ($('.mslide.yellow').html() < threshold && localStorage.getItem("is_my_state")){  
        refill_gold();
    }
}


function mainPage(){
    var mainPageInterval = setInterval(function(){
        if ($('#mob_box_region_1').length && !$('#my_mob_box').length){
            clearInterval(mainPageInterval);
            let lastRefill = new Date(JSON.parse(localStorage.getItem("last_refill"))).toLocaleString();
            if ($('#mob_box_region_2').attr('action').replace('map/state_details/', '') == myState){
                $('#content').prepend('<div id="my_mob_box" class="mob_box"><div id="my_refill" class="button_red index_auto pointer mslide">Refill now</div><div class="tiny">Last refill: ' + lastRefill + ' (state:' + myState +')</div></div>');
                $('#my_refill').click(refill_gold);
                localStorage.setItem("is_my_state", true);
            } else{
                $('#content').prepend('<div id="my_mob_box" class="mob_box"><div class="button_white index_auto pointer mslide">Not your state</div><div class="tiny">Last refill: ' + lastRefill + ' (state:' + myState +')</div></div>');
                localStorage.setItem("is_my_state", false);
            }
        }
    })

    
}

