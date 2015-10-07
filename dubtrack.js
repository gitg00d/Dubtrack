$("head").append('<style src="https://rawgit.com/Netox005/Test/master/dubtrack.css"/>');

$("head").append('<style>.left_section:not(fullscreenLeft){position:fixed!important;cursor:pointer;webkit-user-select:none;user-select:none;-moz-user-select:none;-ms-user-select:none;}</style>');
$(".user-header-menu").prepend('<li><button id="vidEditBtn" style="font-size: 1em;height: 32px;margin-right: 16px;border-radius: 0.1875em;" onclick="videoEdit()">Video Edit</button></li>');

var video = $(".left_section");
var editMode = false;

function videoEdit(e) {
    if(editMode) {
        $(document).click();
        $("#vidEditBtn").css("background", "white");
        $("#vidEditBtn").css("color", "black");
    } else {
        $("#vidEditBtn").css("background", "inherit");
        $("#vidEditBtn").css("color", "inherit");
    }
    editMode = !editMode;
}

/* Drag */
var mousePress = false, wasMoved = false;
var lastMousePos = { x: -1, y: -1 };
$(document).mousemove(function(e) {
    if(!wasMoved) return;

    var vidPos = video.position();
    var x = vidPos.left + (e.pageX - lastMousePos.x), y = vidPos.top + (e.pageY - lastMousePos.y);

    video.css("left", x + "px");
    video.css("top", y + "px");

    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
});
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
