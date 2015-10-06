$("head").append('<style src="https://rawgit.com/Netox005/Test/master/dubtrack.css"/>');

var video = $(".left_section");
video.css("position", "fixed");
var mousePress = false, wasMoved = false;
var lastMousePos = { x: -1, y: -1 };
$(document).mousemove(function(e) {
    if(!wasMoved) return;

    var sqrPos = square.position();
    var x = sqrPos.left + (e.pageX - lastMousePos.x) y = sqrPos.top + (e.pageY - lastMousePos.y);

    video.css("left", x + "px");
    video.css("top", y + "px");

    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
})
video.mousemove(function(e) {
    if(!mousePress) return;
    wasMoved = true;
});
video.mousedown(function(e) {
    mousePress = true;
    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
});
$(document).mouseup(function(e) {
    mousePress = false;
    wasMoved = false;
});
