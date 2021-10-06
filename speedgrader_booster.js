// ==UserScript==
// @name         LiveViewInSpeedgrader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://his.instructure.com/courses/*/gradebook/speed_grader*
// @grant        GM_addStyle
// ==/UserScript==

var ifram_el=null;
var iframe_timer = setInterval(wait_for_iframe, 250);
var iframe_data_timer=null;
var dugga_url=null;

var course=null;
var assignment=null;
var student=null;

document.getElementById('iframe_holder').style.display="none";

let gradebook=localStorage.getItem('tmp-gradebook');
if(gradebook === null){
    gradebook={};
}else{
    gradebook=JSON.parse(gradebook);
}

function wait_for_iframe() {
    ifram_el = document.getElementById("speedgrader_iframe");
    console.log("Waiting for iframe element");
    if(ifram_el !== null){
        myStopFunction(iframe_timer);
        iframe_data_timer = setInterval(wait_for_iframe_data, 250);
    }
}

function wait_for_iframe_data() {
    var iframe_data = ifram_el.contentWindow.document.getElementsByClassName("not_external");
    console.log("Waiting for iframe data");
    if(iframe_data !== null){
        console.log("Found iframe data: ", iframe_data.length)
        for (var i = 0; i < iframe_data.length; i++) {
            //alert(x[i].href);
            console.log("Found iframe data:",iframe_data[i].href);
            dugga_url=iframe_data[i].href;
            myStopFunction(iframe_data_timer);
            //ifram_el.src=iframe_data[i].href;
            ifram_el.src=dugga_url;

            var divel = document.createElement("div");
            divel.innerHTML="<div style='position:absolute;top:60px;right:0;width:300px;height:25px;background-color:rgba(255,0,0,0.4)';color:white;>"+dugga_url+"</div>";
            document.body.append(divel);

            // Parse course,assignment, and student
            // https://his.instructure.com/courses/4780/gradebook/speed_grader?assignment_id=17031&student_id=8270
            var url=document.location.href;
            url=url.replace('https://his.instructure.com/courses/','');
            var course=url;
            course=course.substr(0,course.indexOf('/'));
            var tmp=url.split('?')[1];
            var params=tmp.split('&');
            for(const param of params){
                const kv = param.split('=');
                if(kv[0].indexOf('assignment_id')!=-1){
                    assignment=kv[1];
                }
                if(kv[0].indexOf('student_id')!=-1){
                    student=kv[1];
                }
            }
            console.log(url,course,assignment,student);
        }
    }
}

function myStopFunction(timer) {
  clearInterval(timer);
}

var grade_input=document.getElementById('grading-box-extended');
grade_input.addEventListener('keyup', function(event){
    if(gradebook[student] === undefined){
        gradebook[student]={};
    }
    //if(gradebook[student][assignment] === undefined) {
    gradebook[student][assignment]=event.target.value;
    //}
    localStorage.setItem('tmp-gradebook',JSON.stringify(gradebook))
});
console.log(grade_input);