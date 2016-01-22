// ==UserScript==
// @name        [Dubtrack] Props Command
// @namespace   me.netux.dubtrack.propscommand
// @author      netux (@Netox005 on GitHub)
// @description props command for Dubtrack.FM
// @include     https://www.dubtrack.fm/*
// @version     1
// @grant       none
// ==/UserScript==

// Warning: To use this extension, install Greasemonkey Add-On on Firefox or Tampermonkey Extension on Chrome and then open the link

if(typeof(propsCmd) === 'undefined') propsCmd = { msgs: [ '@%dj% I like your song. Keep it up!' ] };
propsCmd.initEvents = function() {
    function addSystemMsg(msg, color) {
        $('<li class="system" ' + (color ? 'style="color: ' + color + ';"' : '') + '></li>')
            .text(msg)
            .appendTo('#chat .chat-container .chat-messages .chat-main');
        Dubtrack.room.chat.lastItemEl = null;
    }

    $('#chat-txt-message').on('keydown', function(e) {
        var keyCode = e.which || e.keyCode,
            $target = $(e.target);
        if(keyCode !== 13) return;
        if(!/^(!|\/)prop(|s)/.test($target.val())) return;
        $target.val('');
        if(Dubtrack.room.player.activeSong.get('startTime') === null) {
            addSystemMsg("Someone has to be playing a song for you to prop!", '#f00');
            return;
        }
        var dj = Dubtrack.room.player.activeSong.get('user');
        if(dj.get('userInfo').userid === Dubtrack.session.get('userInfo').userid) {
            addSystemMsg("You can't prop yourself!", '#f00');
            return;
        }
        var msg = propsCmd.msgs[Math.floor(Math.random() * propsCmd.msgs.length)];
        msg = msg.replace(/%dj%/, dj.get('username'));
        msg = msg.replace(/%me%/, Dubtrack.session.get('username'));
        $target.val(msg);
        if(Dubtrack.room.chat.chatSoundFilter !== 'off')
            Dubtrack.room.chat.mentionChatSound.play();
    });

    $('#chat .display-chat-settings').click(propsCmd.renderMessages);
    var optionsUlEl = $('#chat .chat-options .chat-option-buttons-propscmd ul');
    optionsUlEl.parent().children('.save').click(function(e) {
        propsCmd.msgs = [ ];
        optionsUlEl.find('li input').each(function(i, el) {
            var $el = $(el);
            if($el.val().length !== 0) propsCmd.msgs.push($el.val().trim());
        });
        if(propsCmd.msgs.length === 0) propsCmd.msgs.push('@%dj% I like your song. Keep it up!');
        localStorage.setItem('propscmd-msgs', propsCmd.msgs.join('%|%'));
    });

};
propsCmd.render = function() {
    $('<link id="propscmd-stylesheet" rel="stylesheet" type="text/css" href="https://netox005.github.io/Dubtrack/css/others/propscmd.css" />').appendTo('head');

    var optionsTabEl = $('#chat .chat-options');
        optionsTabEl.append('<span class="chat-option-header">Props Command - Messages</span>');
    var optionsUlEl = $('<div class="chat-option-buttons chat-option-buttons-propscmd"><ul></ul></div>').appendTo(optionsTabEl);
        optionsUlEl = optionsUlEl.children('ul');

    propsCmd.renderMessages = function() {
        optionsUlEl.children().remove();
        function messageEl(str) {
            var resultEl = $('<li class="message"></li>');

            var inputEl = $('<input type="text"/>');
            inputEl.val(str);
            inputEl.appendTo(resultEl);

            var addEl = $('<div class="button add"></div>');
            addEl.click(function(e) { messageEl('').insertAfter(resultEl); });
            addEl.appendTo(resultEl);

            var removeEl = $('<div class="button remove"></div>');
            removeEl.click(function(e) {
                if(optionsUlEl.children().length === 1) return;
                resultEl.remove();
            });
            removeEl.appendTo(resultEl);

            return resultEl;
        }
        propsCmd.msgs.forEach(function(msg) {
            messageEl(msg).appendTo(optionsUlEl);
        });
    };
    propsCmd.renderMessages();

    $('<span class="save">Save</span>').insertAfter(optionsUlEl);
};
propsCmd.load = function() {
    if(propsCmd.active !== undefined) return;
    propsCmd.active = true;
    console.log('Props Command →', 'loading...');
    var interval = setInterval(function() {
        if(!$('#chat-txt-message').length) return;
        if(typeof(Dubtrack) === 'undefined') return;
        if(!Dubtrack.room || Object.keys(Dubtrack.room).length === 0) return;

        if(localStorage.getItem('propscmd-msgs') !== null)
            propsCmd.msgs = localStorage.getItem('propscmd-msgs').split('%|%');

        propsCmd.render();
        propsCmd.initEvents();

        clearInterval(interval);
        console.log('Props Command →', 'started!');
    }, 100);

};

if(document.readyState === 'complete') propsCmd.load();
else {
    document.addEventListener('readystatechange', function(e) {
        if(document.readyState === 'complete') propsCmd.load();
    });
}