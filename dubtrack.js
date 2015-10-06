$("head").append('<style src="https://rawgit.com/Netox005/Test/master/dubtrack.css"/>');

var video = $(".left_section");
video.css("position", "fixed");
var mousePress = false, wasMoved = false;
var lastMousePos = { x: -1, y: -1 };
$(document).on("mousemove", function(e) {
    if(!wasMoved) return;

    var vidPos = video.position();
    var x = vidPos.left + (e.pageX - lastMousePos.x) y = vidPos.top + (e.pageY - lastMousePos.y);

    video.css("left", x + "px");
    video.css("top", y + "px");

    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
});
video.on("mousemove", function(e) {
    if(!mousePress) return;
    wasMoved = true;
});
video.on("mousedown", function(e) {
    mousePress = true;
    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
});
$(document).on("mouseup", function(e) {
    mousePress = false;
    wasMoved = false;
});
