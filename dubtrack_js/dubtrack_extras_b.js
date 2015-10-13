$("head").append('<style>#player-controller ul li.remove-if-iframe.display-block{border-right: 0;}li.volume-button a span.icon-volume-down:before{padding-right: 5.5px;}li.volume-button a span.icon-volume-off:before{padding-right: 9.6094px;}.noanim.volume.remove-if-iframe.display-block{border-right-width: 0;}.volume-button{cursor:pointer;-webkit-user-select:none; user-select:none; -moz-user-select:none; -ms-user-select:none;}</style>');
$("head").append('<style>.chat-updubed,.chat-current-song-dj{color: cyan;}.chat-downdubed,.chat-current-song-name{color: #FF0080;}.chat-plus-users{top: -.5em;color: white;position: relative;font-size: .8em;}.chat-plus-users:hover{color: #8A8A8A;}</style>');
$("head").append('<style>.chat-current-song-dj{color: cyan;}.chat-current-song-name{color: magenta;}</style>');

$("#player-controller .left ul .volume").after('<li class="volume-button"><a onclick="volumeBtn()"><span></span></a></li>');

var currentUser, currentUserID, currentDJUsername;
var volSpan, lastVolume, volUpdate = false;
var chat, chatLog = { join: false, leave: false, updub: true, downdub: true, songChange: true }, chatSeparationOnSongChange = true;
var totalDubs, localUpdubs = 0, localDowndubs = 0;
var lastUpdubLog = null, lastDowndubLog = null, lastUpdubLogTotal = 0, lastDowndubLogTotal = 0;
function dbe_init() {
    if(Dubtrack.session) {
        currentUser = Dubtrack.session.get('username');
        currentUserID = Dubtrack.session.attributes.userInfo.userid;
    }

    chat = $("section#chat  .chat-container .chat-messages.ps-container .chat-main");

    volSpan = $(".volume-button a span");
    lastVolume = getVolume();
    volUpdate = true;
    $("#volume-div a").bind('style', function() { volSpan.attr("class", volumeClass()); });

    totalDubs = $("#maindubtotal.dubstotal");
    if(Dubtrack.room.player !== undefined && Dubtrack.room.player.activeSong.attributes.song !== null) {
        currentDJUsername = getUsernameById(Dubtrack.room.player.activeSong.attributes.song.userid);
        localUpdubs = Dubtrack.room.player.activeSong.attributes.song.updubs;
        localDowndubs = Dubtrack.room.player.activeSong.attributes.song.downdub;
    } else {
        if(parseInt(totalDubs.text()) < 0) localDowndubs = parseInt(totalDubs.text());
        else localUpdubs = parseInt(totalDubs.text());
    }
    //localUpdubs = parseInt(totalDubs.text());
    totalDubs.attr("title", constructTotalDubsTitle);

    console.log("Dubtrack-Extras -> INITIALIZED");
}
$(document).ready(dbe_init);

/* Volume button */
function updateVolumeClass() {
    if(!volUpdate) {
        volUpdate = true;
        return;
    }
    if(volSpan !== undefined)
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

function showUsersWhoDubed(chatLog, updub) {
    var wasHidden = chatLog.children("#all-usernames").css("display") === 'none';
    chatLog.children("#all-usernames").css("display", wasHidden ? 'initial' : 'none');
    //chatLog.children(".chat-plus-users").css("display", chatLog.children(".chat-plus-users").css("display") === 'none' ? 'initial' : 'none');
    if(wasHidden) chatLog.children(".chat-plus-users").text(' [hide]');
    else chatLog.children(".chat-plus-users").text('+' + chatLog.children(".chat-plus-users").attr('val') + ' [show]');
}

function getUsernameById(id) {
    var byId = Dubtrack.cache.users.collection._byId[id];
    return byId === null ? null : byId.attributes.username;
}

function updateCurrentDJUsername(callback) {
    var player = Dubtrack.room.player;
    if(player === null || player === undefined || player.activeSong === null || player.activeSong.attributes.song === null) return;
    currentDJUsername = getUsernameById(Dubtrack.room.player.activeSong.attributes.song.userid);
    /*
    Dubtrack.helpers.sendRequest(
        "https://api.dubtrack.fm/user/" + player.activeSong.attributes.song.userid,
        null,
        'GET',
        callback ? callback : function(r, xhr, msg) { currentDJUsername = xhr.data.username; }
    );
    */
}

/* On updub/downdub */
Dubtrack.Events.bind('realtime:room_playlist-dub', function(data) {
    if(currentDJUsername === null)
        updateCurrentDJUsername();

    var dataUser = data.user, songAttr = Dubtrack.room.player.activeSong.attributes;
    var isUpdub = data.dubtype === 'updub', isCurrentUser = data.user.username === currentUser, isUserDJ = songAttr === undefined ? false : (songAttr.song.userid === currentUserID);
    var chatLogUser = '<a href="#" class="username user-' + dataUser.userInfo.userid + '" onclick="Dubtrack.helpers.displayUser(\'' + dataUser.userInfo.userid + '\', this);" class="cursor-pointer">@' + (isCurrentUser ? 'you' : dataUser.username) + '</a>',
        chatLogHTML = '<li class="chat-system-loading">' + chatLogUser + ' <span id="all-usernames" style="display: none;"></span><span class="chat-plus-users cursor-pointer" style="display: initial;" onclick="showUsersWhoDubed($(this).parent());"></span> <span class="chat-' + data.dubtype + 'ed">' + data.dubtype + 'ed</span> <span title="' + (songAttr === undefined ? $(".currentSong").text() : ('[' + songAttr.songInfo.name + '] played by [' + currentDJUsername + ']')) + '">' + (isUserDJ ? 'your' : 'this') + ' track</span></li>';

    var _localDubs = isUpdub ? localUpdubs : localDowndubs, _lastDubLog = isUpdub ? lastUpdubLog : lastDowndubLog, _lastDubLogTotal = isUpdub ? lastUpdubLogTotal : lastDowndubLogTotal, chatLogDub = isUpdub ? chatLog.updub : chatLog.downdub;

    _localDubs++;
    if(chatLogDub) {
        try {
            if(_lastDubLog === null) _lastDubLog = $(chatLogHTML).appendTo(chat);
            else {
                _lastDubLogTotal++;
                _lastDubLog.children("#all-usernames").html(_lastDubLog.children("#all-usernames").html().replace(' and', ','));
                _lastDubLog.children("#all-usernames").append(' and ' + chatLogUser);
                if(_lastDubLog.children(".chat-plus-users").css('display') !== 'none') {
                    _lastDubLog.children(".chat-plus-users").text('+' + _lastDubLogTotal + ' [show]');
                    _lastDubLog.children(".chat-plus-users").attr('val', _lastDubLogTotal);
                }
            }
            Dubtrack.room.chat.scrollToBottom = true
            Dubtrack.room.chat.scollBottomChat();
        } catch(e) {_lastDubLog = $(chatLogHTML).appendTo(chat); } // ? D:
    }

    if(isUpdub) {
        //localUpdubs = _localDubs;
        lastUpdubLog = _lastDubLog;
        lastUpdubLogTotal = _lastDubLogTotal;
    } else {
        //localDowndubs = _localDubs;
        lastDowndubLog = _lastDubLog;
        lastDowndubLogTotal = _lastDubLogTotal;
    }

    localUpdubs = songAttr.song.updubs;
    localDowndubs = songAttr.song.downdubs;

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

/* On song change */
//$('.currentSong').bind('DOMSubtreeModified', function(data) {
Dubtrack.Events.bind('realtime:room_playlist-update', function(data) {
    updateLastDub();
    localUpdubs = 0;
    localDowndubs = 0;
    if(totalDubs !== null) totalDubs.attr("title", constructTotalDubsTitle);

    var chatLogStr = '<li class="chat-system-loading" ' + (chatSeparationOnSongChange ? 'style="border-top: 2px solid #5a5b5c ;"' : '') + '>Now Playing <span class="chat-current-song-name">' + data.songInfo.name + '</span>, DJ is <span class="chat-current-song-dj">[loading...]</span></li>';
    var chatLogHTML = $(chatLogStr).appendTo(chat);
    /*
    updateCurrentDJUsername(function(r, xhr, msg) {
        currentDJUsername = xhr.data.username;
        chatLogHTML.html(chatLogHTML.html().replace('[loading...]', currentDJUsername));
    });
    */
    currentDJUsername = getUsernameById(Dubtrack.room.player.activeSong.attributes.song.userid);
    chatLogHTML.html(chatLogHTML.html().replace('[loading...]', currentDJUsername));
});
