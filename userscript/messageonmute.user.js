// ==UserScript==
// @name         [Dubtrack] Message On Mute
// @namespace    me.netux.dubtrack.warnonmute
// @version      1
// @description  append message to chat when someone is muted.
// @author       You
// @match        https://www.dubtrack.fm/*
// @grant        none
// ==/UserScript==

var WarnOnMute = setInterval(function() {
    if(typeof(Dubtrack) === 'undefined') return;

    Dubtrack.Events.bind('realtime:user-mute', function(data) {
        $('<li class="system mute">@' + data.mutedUser.username + ' has been muted by @' + data.user.username + '</li>').appendTo('#main-room #chat .chat-container .chat-messages .chat-main');
    });
    Dubtrack.Events.bind('realtime:user-unmute', function(data) {
        $('<li class="system unmute">@' + data.mutedUser.username + ' has been unmuted by @' + data.user.username + '</li>').appendTo('#main-room #chat .chat-container .chat-messages .chat-main');
    });

    clearInterval(WarnOnMute);
}, 100);