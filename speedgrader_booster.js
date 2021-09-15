// ==UserScript==
// @name         LiveViewInSpeedgrader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://his.instructure.com/courses/*/gradebook/speed_grader*
// @grant        GM_addStyle
// ==/UserScript==

var ifram_el;
var iframe_timer = setInterval(wait_for_iframe, 250);
var iframe_data_timer;
var dugga_url;

document.getElementById('iframe_holder').style.display="none";

function wait_for_iframe() {
    ifram_el = document.getElementById("speedgrader_iframe");
    //console.log("Waiting for iframe element");
    if(ifram_el !== null){
        myStopFunction(iframe_timer);
        iframe_data_timer = setInterval(wait_for_iframe_data, 250);
    }
}

function wait_for_iframe_data() {
    var iframe_data = ifram_el.contentWindow.document.getElementsByClassName("not_external");
    console.log("Waiting for iframe data");
    if(iframe_data !== null){
        for (var i = 0; i < iframe_data.length; i++) {
            //alert(x[i].href);
            //console.log("Found iframe data:",iframe_data[i].href);
            myStopFunction(iframe_data_timer);
            ifram_el.src=iframe_data[i].href;
        }
    }
}

function myStopFunction(timer) {
  clearInterval(timer);
}