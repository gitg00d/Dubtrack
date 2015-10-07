$("head").append('<style src="https://rawgit.com/Netox005/Test/master/dubtrack.css"/>');
$("head").append('<style>.left_section:not(fullscreenLeft){position:fixed!important;cursor:pointer;webkit-user-select:none;user-select:none;-moz-user-select:none;-ms-user-select:none;}</style>');
$(".user-header-menu").prepend('<li><button style="font-size: 1em;height: 32px;margin-right: 16px;border-radius: 0.1875em;">Video Drag Mode</button></li>');

var video = $(".left_section");
var mousePress = false, wasMoved = false;
var lastMousePos = { x: -1, y: -1 };
$(document).on("mousemove", function(e) {
    if(!wasMoved) return;

    var vidPos = video.position();
    var x = vidPos.left + (e.pageX - lastMousePos.x), y = vidPos.top + (e.pageY - lastMousePos.y);

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
