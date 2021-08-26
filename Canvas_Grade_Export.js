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

    document.addEventListener('click', function (event) 
    {
        if(event.target.className=="Grid__GradeCell__StartContainer"){
            var assignmentstr=event.target.parentNode.parentNode.className;
            var studentstr=event.target.parentNode.parentNode.parentNode.className;
            var assignmentcode=assignmentstr.substr(assignmentstr.indexOf("_")+1);
            assignmentcode=assignmentcode.split(" ")[0];

            var studentcode=studentstr.substr(studentstr.indexOf("_")+1);;
            studentcode=studentcode.split(" ")[0];

            alert(assignmentcode+" "+studentcode);

            var coursecode = "4780";

            // https://his.instructure.com/courses/4780/gradebook/speed_grader?assignment_id=17002&student_id=52422

            var speedurl=`https://his.instructure.com/courses/${coursecode}/gradebook/speed_grader?assignment_id=${assignmentcode}&student_id=${studentcode}`;
            document.body.innerHTML = `<iframe src=${speedurl} ></iframe>` + document.body.innerHTML;
        }
    });    
  
    document.getElementById("hulk").addEventListener('click', function () 
    {
        // Read student names
        var sven = document.getElementsByClassName("canvas_0");
        var stud=[];
        for(var j=0;j<sven.length;j++){
            var test = sven[j].getElementsByClassName("slick-row");
            for (var i=0; i<test.length; i++) {
                studid=test[i].className.substr(test[i].className.indexOf("_")+1);
                var students=test[i].getElementsByTagName("a");
                for (var k=0; k<students.length; k++) {
                    stud["s"+studid]=students[k].innerHTML;
                }
            }            
        }

        var thedata=[];

        // Read headers
        var sven = document.getElementsByClassName("headers_1");
        var theaders=[];
        for(var j=0;j<sven.length;j++){
            var test = sven[j].getElementsByClassName("slick-header-column");
            for (var i=0; i<test.length; i++) {
                var assignmentid=test[i].className.substr(test[i].className.indexOf("_")+1);
                var title=test[i].title;
                theaders["a"+assignmentid]=title;
            }            
        }

        // Read data
        var sven = document.getElementsByClassName("viewport_1");
        for(var j=0;j<sven.length;j++){
            var test = sven[j].getElementsByClassName("slick-row");
            for (var i=0; i<test.length; i++) {
                // All other rows setup
                studid=test[i].className.substr(test[i].className.indexOf("_")+1);
                var grades=test[i].getElementsByClassName("assignment");

                // Before first row generate headings
                if(i==0){
                    var outgrades=[];
                    outgrades.push("Student");
                    for (var k=0; k<grades.length; k++) {
                      var assignmentid=grades[k].className.substr(grades[k].className.indexOf("_")+1);
                      outgrades.push(theaders["a"+assignmentid]);
                    }
                    thedata.push(outgrades);
                }

                // All other rows generate data
                var outgrades=[];
                outgrades.push(stud["s"+studid]);
                for (var k=0; k<grades.length; k++) {
                  var assignmentid=grades[k].className.substr(grades[k].className.indexOf("_")+1);
                  var grade=grades[k].innerText;
                  outgrades.push({assignment:assignmentid, grade:grade});
                }
                thedata.push(outgrades);
            }                          
        }

        // Produce output
        var str="";
      
      	for(var i=0;i<thedata.length;i++){
          	if(i==0){
                for(var j=0;j<thedata[i].length;j++){
                    if(j>0) str+=",";
                    str+=thedata[i][j];
                }
            }else{
                for(var j=0;j<thedata[i].length;j++){
                    if(j>0) str+=",";
                    if(j==0){
                        str+=thedata[i][j];
                    }else{
                        str+=thedata[i][j].grade;
                    }
                }
            }
          	str+="\n";
        }

        alert(str);

    });   
}