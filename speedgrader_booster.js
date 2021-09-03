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

function wait_for_iframe() {
    ifram_el = document.getElementById("speedgrader_iframe");
    if(ifram_el !== null){
        myStopFunction(iframe_timer);
        iframe_data_timer = setInterval(wait_for_iframe_data, 250);
    }
}

function wait_for_iframe_data() {
    var x = ifram_el.contentWindow.document.getElementsByClassName("not_external");
    if(x){
        myStopFunction(iframe_data_timer);
        var i;
        for (i = 0; i < x.length; i++) {
            //alert(x[i].href);
            ifram_el.src=x[i].href;
        }
    }
}

function myStopFunction(timer) {
  clearInterval(timer);
}

