$("head").append('<style src="https://rawgit.com/Netox005/Dubtrack/master/dubtrack.css"/>');

var stylesheet = '<style>' +
                         '.no-selection, #vidEditDiv { webkit-user-select:none; user-select:none; -moz-user-select:none; -ms-user-select:none; }' +
                         '.left_section:not(fullscreenLeft), #vidEditDiv { position:fixed!important; }' +
                         '#vidEditDiv{cursor:pointer; z-index: 999999;}' +
                 '</style>',
    buttons = '<li>' +
                  '<button id="vidEditBtn" style="font-size: 0.75em; height: 32px; margin-right: 0px; border-right-width: 0em;border-bottom-right-radius: 0;border-top-right-radius: 0;" onclick="videoEdit()">Video Pane Editor</button>' +
                  '<button id="vidEditPaneBtn" style="font-size: 1em; height: 32px; margin-right: 16px; border-radius: 0.1875em; border-left-width: 0em; border-top-left-radius: 0; border-bottom-left-radius: 0;">↓</button>' +
              '</li>',
    pane = '<div id="vidEditDiv" style="background:rgba(255, 190, 0, 0.7);top:0;left:0;display:none;"></div>';

$("head").append(stylesheet);
$(".user-header-menu").prepend(buttons);
$("#main-room").append(pane)

$("#main-menu-left").css("z-index", 999998); // hü3

var video = $(".left_section"), vidEditBtn = $("#vidEditBtn"), vidEditDiv = $("#vidEditDiv");
var editMode = false;

function videoEdit(e) {
    vidEditDiv.css("left", video.offset().left);
    vidEditDiv.css("top", video.offset().top);
    vidEditDiv.width(video.outerWidth());
    vidEditDiv.height(video.outerHeight());

    if(editMode) $(document).click();

    $("#vidEditBtn").css("box-shadow", editMode ? "" : "inset 0 -2px cyan");
    vidEditDiv.css("display", editMode ? "none" : "block");

    editMode = !editMode;
    if(window.location.href.indexOf("https://www.dubtrack.fm") !== 0) console.log("editMode = " + editMode);

}

/* Drag */
var mousePress = false, wasMoved = false;
var lastMousePos = { x: -1, y: -1 };
$(document).mousemove(function(e) {
    if(!editMode) return;
    if(!wasMoved) return;

    var vidPos = video.position();
    var x = vidPos.left + (e.pageX - lastMousePos.x), y = vidPos.top + (e.pageY - lastMousePos.y);

    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(x > $(window).outerWidth() - video.outerWidth()) x = $(window).outerWidth() - video.outerWidth();
    if(y > $(window).outerHeight() - video.outerHeight()) x = $(window).outerHeight() - video.outerHeight();

    video.css("left", x + "px");
    video.css("top", y + "px");
    vidEditDiv.css("left", video.offset().left);
    vidEditDiv.css("top", video.offset().top);

    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
});
vidEditDiv.mousemove(function(e) {
    if(!editMode) return;
    if(!mousePress) return;
    wasMoved = true;
});
vidEditDiv.mousedown(function(e) {
    if(!editMode) return;
    mousePress = true;
    lastMousePos.x = e.pageX;
    lastMousePos.y = e.pageY;
});
$(document).mouseup(function(e) {
    if(!editMode) return;
    mousePress = false;
    wasMoved = false;
});
