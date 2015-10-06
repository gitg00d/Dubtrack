$("head").append('<style src="https://rawgit.com/Netox005/Test/master/dubtrack.css"/>');

var mousePress = false;
var dragVideoEvent = function(e) {
    if(!mousePress) return;
    console.log("test");
}
$(".left_section").mousemove(dragVideoEvent);
$(".left_section").onmousedown(function(e) { mousePress = true; });
$(".left_section").onmouseup(function(e) { mousePress = false; });
