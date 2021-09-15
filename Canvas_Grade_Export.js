// ==UserScript==
// @name        Canvas Export
// @namespace   canvasexport
// @description Exporting Grades for Ladok
// @include     https://his.instructure.com/courses/*/gradebook
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

function colorGrades()
{
    var grades = document.getElementsByClassName('Grade');
    for (var i=0, len=grades.length|0; i<len; i=i+1|0) {
        var grade=grades[i];
        // console.log("Grade:",grade.innerHTML)
        if(grade.innerHTML=="G"){
            grade.parentElement.parentElement.style.backgroundColor="#ccffcc";
        }else if(grade.innerHTML=="U"){
            grade.parentElement.parentElement.style.backgroundColor="#ffcccc";
        }
    }
}

var colorInterval = setInterval(colorGrades,250);

setTimeout(function(){ makebutton(); }, 5000);

function makebutton()
{

    var css = '.Grid__GradeCell__StartContainer { background-image: url("https://dugga.iit.his.se/Shared/icons/FistV.png"); background-repeat: no-repeat; background-size: 28px 28px;}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    head.appendChild(style);

    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

		var test = document.getElementsByClassName("gradebook-menus");
  	for (var i=0; i<test.length; i++) {
        test[i].innerHTML="<button id='hulk'>Export</button>"+test[i].innerHTML;
    }

    document.addEventListener('click', function (event)
    {
        if(event.target.className=="Grid__GradeCell__StartContainer"){
            //console.log(event.target, event.target.parentNode);
            if(event.target.parentNode.className.indexOf("missing")!=-1){
                //console.log("Student has NO submission",event.target.parentNode.className);
                alert("Studenten har inte gjort någon inlämning på denna duggan!");
                return;
            }else{
                //console.log("Student has submission",event.target.parentNode.className);
            }

            var assignmentstr="UNK";
            var studentstr="UNK";
            var assignmentcode="UNK";
            var has_submission="UNK";
            if(event.target.parentNode && event.target.parentNode.parentNode){
                //console.log("parent node",event.target.parentNode);
                assignmentstr=event.target.parentNode.parentNode.className;
            }
            if(event.target.parentNode.parentNode && event.target.parentNode.parentNode.parentNode.className){
                //console.log("parent parent node",event.target.parentNode.parentNode);
                studentstr=event.target.parentNode.parentNode.parentNode.className;
            }

            //console.log(assignmentstr,studentstr,assignmentcode);

            if(assignmentstr != "UNK" && studentstr !="UNK"){
                assignmentcode=assignmentstr.substr(assignmentstr.indexOf("_")+1);
                assignmentcode=assignmentcode.split(" ")[0];

                var studentcode=studentstr.substr(studentstr.indexOf("_")+1);;
                studentcode=studentcode.split(" ")[0];

                // alert(assignmentcode+" "+studentcode);

                let tmpstr = document.location.href.replace("https://his.instructure.com/courses/","");
                var coursecode=tmpstr.substr(0,tmpstr.indexOf('/'));
                if(isNaN(coursecode)){
                    alert("Could not find current canvas coursecode:'"+coursecode+"'");
                }
                //console.log(tmpstr,tmpstr.substr(0,tmpstr.indexOf('/')),coursecode)

                // https://his.instructure.com/courses/4780/gradebook/speed_grader?assignment_id=17002&student_id=52422

                var speedurl=`https://his.instructure.com/courses/${coursecode}/gradebook/speed_grader?assignment_id=${assignmentcode}&student_id=${studentcode}`;
                document.getElementById("header").innerHTML += `<div id='speedy-container' style='position:fixed;left:50px;top:50px;right:50px;bottom:50px;' ><iframe id='speedy' style='' width='100%' height='900px;' src=${speedurl} ></iframe><input style='position:absolute;top:0;right:0;' value='Dismiss' type='button' onclick='this.parentNode.style="display:none"'></div>`;
            }
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