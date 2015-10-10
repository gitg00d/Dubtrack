$("head").append('<style>#player-controller ul li.remove-if-iframe.display-block{border-right: 0;}li.volume-button a span.icon-volume-down:before{padding-right: 5.5px;}li.volume-button a span.icon-volume-off:before{padding-right: 9.6094px;}.noanim.volume.remove-if-iframe.display-block{border-right-width: 0;}.volume-button{cursor:pointer;-webkit-user-select:none; user-select:none; -moz-user-select:none; -ms-user-select:none;}</style>');
$("head").append('<style>.chat-updubed{color:cyan;}.chat-downdubed{color:magenta;}</style>');

$("#player-controller .left ul .volume").after('<li class="volume-button"><a onclick="volumeBtn()"><span></span></a></li>');

var currentUser = Dubtrack.session.get('username');
var volSpan, lastVolume = getVolume(), volUpdate = true;
var chat, chatLog = false;
var totalDubs, localUpdubs = 0, localDowndubs = 0;
function dbe_init() {
    chat = $("section#chat  .chat-container .chat-messages.ps-container .chat-main");
    volSpan = $(".volume-button a span");
    totalDubs = $("#maindubtotal.dubTotal");
    console.log("Dubtrack-Extras -> INITIALIZED");
}
$(document).ready(dbe_init);
$(document).ready();

/* Volume button */
$("#volume-div a").bind('style', function() { volSpan.attr("class", volumeClass()); });

function updateVolumeClass() {
    if(!volUpdate) {
        volUpdate = true;
        return;
    }
    volSpan.attr("class", volumeClass());
}
setInterval(updateVolumeClass, 100);

function volumeBtn() {
    var isZero = getVolume() === 0;
    if(!isZero) lastVolume = getVolume();

    $("#volume-div div").css("width", (isZero ? lastVolume : 0) + '%');
    $("#volume-div a").css("left", (isZero ? lastVolume : 0) + '%');

    Dubtrack.room.player.setVolume(isZero ? lastVolume : 0);         // Dunno the difference
    //Dubtrack.room.player.setVolumeRemote(isZero ? lastVolume : 0); // Dunno the difference

    volSpan.attr("class", volumeClass());
    volUpdate = false;
}

function volumeClass() {
    var v = getVolume();

    if(v > 50) return "icon-volume-up";
    else if(v > 0) return "icon-volume-down";
    else return "icon-volume-off";
}

function getVolume() {
    var str = $("#volume-div a").css("left");
    return parseInt(str.substring(0, str.length - 1));
}

/* On updub/downdub */
Dubtrack.Events.bind('realtime:room_playlist-dub', function(data) {
    if(data.user.username === currentUser) return;
    
    console.log(data.user.username + " -> " + data.dubtype + "ed.");
    if(chatLog)
        chat.append('<li class="chat-system-loading"><a href="#" class="username user-' + data.user.userInfo.userid + '">@' + data.user.username + '</a> <span class="chat-' + data.dubtype + 'ed">' + data.dubtype + 'ed</span> your song!</li>');

        if(data.dubtype === 'updub') localUpdubs++;
    else if(data.dubtype == 'downdub') localDowndubs++;
    $(".dubstotal").attr("title", function() {
        var result = "";
        if(localUpdubs > 0) result += '+';
        result += localUpdubs + " updub";
        if(localUpdubs === 1) result += 's';
        result += " | ";
        if(localDowndubs > 0) result += '+';
        result += localDowndubs + " updub";
        if(localDowndubs === 1) result += 's';
        return result;
    });
});

/* On user join */
Dubtrack.Events.bind('realtime:user-join', function(data) {
    if(data.user.username === currentUser) return;
    
    console.log(data.user.username + " -> joined the room");
    if(chatLog)
        chat.append('<li class="chat-system-loading"><a href="#" class="username user-' + data.user.userInfo.userid + '">@' + data.user.username + '</a> joined the room.</li>');
});

/* On user leave */
Dubtrack.Events.bind('realtime:user-leave', function(data) {
    if(data.user.username === currentUser) return;
    
    console.log(data.user.username + " -> left the room");
    if(chatLog)
        chat.append('<li class="chat-system-loading"><a href="#" class="username user-' + data.user.userInfo.userid + '">@' + data.user.username + '</a> left the room.</li>');
});

/* On song change (?) */
Dubtrack.Events.bind('realtime:room_playlist-update', function(data) {
    localUpdubs = 0;
    localDowndubs = 0;
    totalDubs.attr("title", "0 updubs | 0 downdubs");
});
