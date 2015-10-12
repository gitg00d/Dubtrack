$("head").append('<style>#player-controller ul li.remove-if-iframe.display-block{border-right: 0;}li.volume-button a span.icon-volume-down:before{padding-right: 5.5px;}li.volume-button a span.icon-volume-off:before{padding-right: 9.6094px;}.noanim.volume.remove-if-iframe.display-block{border-right-width: 0;}.volume-button{cursor:pointer;-webkit-user-select:none; user-select:none; -moz-user-select:none; -ms-user-select:none;}</style>');
$("head").append('<style>.chat-updubed{color: cyan;}.chat-downdubed{color: #FF0080;}.chat-plus-users{top: -.5em;color: white;position: relative;font-size: .8em;}.chat-plus-users:hover{color: #8A8A8A;}</style>');

$("#player-controller .left ul .volume").after('<li class="volume-button"><a onclick="volumeBtn()"><span></span></a></li>');

var currentUser;
var volSpan, lastVolume, volUpdate = false;
var chat, chatLog = { join: false, leave: false, updub: true, downdub: true };
var totalDubs, localUpdubs = 0, localDowndubs = 0;
var lastUpdubLog = null, lastUpdubLogTotal = 0, lastDowndubLog = null, lastDowndubLogTotal = 0;
function dbe_init() {
    if(Dubtrack.session) currentUser = Dubtrack.session.get('username');

    chat = $("section#chat  .chat-container .chat-messages.ps-container .chat-main");

    volSpan = $(".volume-button a span");
    lastVolume = getVolume();
    volUpdate = true;
    $("#volume-div a").bind('style', function() { volSpan.attr("class", volumeClass()); });

    totalDubs = $("#maindubtotal.dubstotal");
    localUpdubs = parseInt(totalDubs.text());
    totalDubs.attr("title", constructTotalDubsTitle);

    console.log("Dubtrack-Extras -> INITIALIZED");
}
$(document).ready(dbe_init);
$(document).ready();

/* Volume button */
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
    Dubtrack.room.player.setVolume(isZero ? lastVolume : 0);

    volSpan.attr("class", volumeClass());
    volUpdate = false;
}

function volumeClass() {
    var v = getVolume();

    if(v > 50) return "icon-volume-up";
    else if(v > 0) return "icon-volume-down";
    else return "icon-volume-off";
}

function getVolume() { // 0 - 100
    var vol = $("#volume-div div").outerWidth(), volL = $("#volume-div").outerWidth();
    return vol / volL * 100;
}

function constructTotalDubsTitle() {
    var result = "";
    if(localUpdubs > 0) result += '+';
    result += localUpdubs + " updub";
    if(localUpdubs !== 1) result += 's';
    result += " | ";
    if(localDowndubs > 0) result += '-';
    result += localDowndubs + " downdub";
    if(localDowndubs !== 1) result += 's';
    return result;
}

function updateLastDub() {
    lastUpdubLog = null;
    lastDowndubLog = null;
    lastUpdubLogTotal = 0;
    lastDowndubLogTotal = 0;
}

function showUsersWhoDubed(chatLog) {
    console.log(chatLog);
    chatLog.children("#all-usernames").css("display", 'initial');
    chatLog.children(".chat-plus-users").css("display", 'none');
}

/* On updub/downdub */
Dubtrack.Events.bind('realtime:room_playlist-dub', function(data) {
    var isUpdub = data.dubtype === 'updub', isCurrentUser = data.user.username === currentUser;
    var chatLogUser = '<a href="#" class="username user-' + data.user.userInfo.userid + '" onclick="Dubtrack.helpers.displayUser(\'' + data.user.userInfo.userid + '\', this);" class="cursor-pointer">@' + (isCurrentUser ? 'you' : data.user.username) + '</a>',
        chatLogHTML = '<li class="chat-system-loading">' + chatLogUser + ' <span class="chat-plus-users cursor-pointer" style="display: initial;" onclick="showUsersWhoDubed($(this).parent());"></span><span id="all-usernames" style="display: none;"></span> <span class="chat-' + data.dubtype + 'ed">' + data.dubtype + 'ed</span> <span title="' + $(".currentSong").text() + '">this track</span></li>';


    if(isUpdub) {
        localUpdubs++;
        if(chatLog.updub) {
            if(lastUpdubLog === null) lastUpdubLog = $(chatLogHTML).appendTo(chat);
            else {
                try {
                    lastUpdubLogTotal++;
                    lastUpdubLog.children("#all-usernames").html(lastUpdubLog.children("#all-usernames").html().replace(' and', ','));
                    lastUpdubLog.children("#all-usernames").append(' and ' + chatLogUser);
                    lastUpdubLog.children(".chat-plus-users").text('+' + lastUpdubLogTotal);
                } catch(e) {
                    lastUpdubLog = null;
                    console.log("it did it again(updub), but catched this time ;)");
                }
            }
        }
    } else {
        localDowndubs++;
        if(chatLog.downdub) {
            if(lastDowndubLog === null) lastDowndubLog = $(chatLogHTML).appendTo(chat);
            else {
                try {
                    lastDowndubLogTotal++;
                    lastDowndubLog.children("#all-usernames").html(lastDowndubLog.children("#all-usernames").html().replace(' and', ','));
                    lastDowndubLog.children("#all-usernames").append(' and ' + chatLogUser);
                    lastDowndubLog.children(".chat-plus-users").text('+' + lastDowndubLogTotal);
                } catch(e) {
                    console.log("it did it again (downdub), but catched this time ;)");
                    lastDowndubLog = null;
                }
            }
        }
    }

    //console.log(data.user.username + " -> " + data.dubtype + "ed.");
    $(".dubstotal").attr("title", constructTotalDubsTitle);
});

/* On user join */
Dubtrack.Events.bind('realtime:user-join', function(data) {
    if(data.user.username === currentUser) return;

    //console.log(data.user.username + " -> joined the room");
    if(chatLog.join)
        chat.append('<li class="chat-system-loading"><a href="#" class="username user-' + data.user.userInfo.userid + '">@' + data.user.username + '</a> joined the room.</li>');
});

/* On user leave */
Dubtrack.Events.bind('realtime:user-leave', function(data) {
    if(data.user.username === currentUser) return;

    //console.log(data.user.username + " -> left the room");
    if(chatLog.leave)
        chat.append('<li class="chat-system-loading"><a href="#" class="username user-' + data.user.userInfo.userid + '">@' + data.user.username + '</a> left the room.</li>');
});

/* On chat message recieve */
Dubtrack.Events.bind('realtime:chat-message', updateLastDub);

/* On song change afaik */
$('.currentSong').bind('DOMSubtreeModified', function(data) {
    updateLastDub();
    localUpdubs = 0;
    localDowndubs = 0;
    if(totalDubs !== null) totalDubs.attr("title", constructTotalDubsTitle);
});
