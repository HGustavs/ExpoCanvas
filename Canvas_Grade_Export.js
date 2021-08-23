// ==UserScript==
// @name        Canvas Export
// @namespace   canvasexport
// @description Exporting Grades for Ladok
// @include     https://his.instructure.com/courses/*/gradebook
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

setTimeout(function(){ makebutton(); }, 5000);

function makebutton()
{
		var test = document.getElementsByClassName("gradebook-menus");
  	for (var i=0; i<test.length; i++) {
        test[i].innerHTML="<button id='hulk'>Export</button>"+test[i].innerHTML;
    }  

    document.getElementById("hulk").addEventListener('click', function () 
    {
        var sven = document.getElementsByClassName("canvas_0");
        var stud=[];
        for(var j=0;j<sven.length;j++){
            var test = sven[j].getElementsByClassName("slick-row");
            console.log(test.length);
            for (var i=0; i<test.length; i++) {
                studid=test[i].className.substr(test[i].className.indexOf("_")+1);
                var students=test[i].getElementsByTagName("a");
                for (var k=0; k<students.length; k++) {
                    stud["s"+studid]=students[k].innerHTML;
                }
            }            
        }

        var sven = document.getElementsByClassName("viewport_1");
        var thedata=[];

        for(var j=0;j<sven.length;j++){
            var test = sven[j].getElementsByClassName("slick-row");
            console.log(test.length);
            for (var i=0; i<test.length; i++) {
                studid=test[i].className.substr(test[i].className.indexOf("_")+1);
                var grades=test[i].getElementsByClassName("assignment");
                for (var k=0; k<grades.length; k++) {
                    assignmentid=grades[k].className.substr(grades[k].className.indexOf("_")+1);
                    console.log(assignmentid);     
                }
                
            }                          
        }


    });   
}