var DTELite = {
    lastSongID: undefined,

    msgSwitchIndex: 0,
    savedMsgs: [ ],
    currentMsg: undefined,
    lastPlus: undefined,
    lastDash: undefined,
    roomSettings: { enabled: false },
    atLobby: false,

    nsfwDialogBoxEl: undefined,

    boothNotificationBool: false,
    roomSettingsBool: false
}
DTELite.render = function() {
    var stylesheetUrl = 'https://netox005.github.io/Dubtrack/css/others/dte-lite.css';
    DTELite.stylesheetEl = $('<link href="' + stylesheetUrl + '" rel="stylesheet" type="text/css"/>').appendTo('head');

    // > Room Favorites < \\
    var roomFavEl = $('<a href="#" class="room-fav" title="Add Room to Favorites"><span class="icon-heart"></span></a>').insertAfter('#main-room-active-link'),
        roomFavsStr = localStorage.getItem('dte-roomfavs');
    roomFavEl.click(function(e) {
        var roomFavsStr = localStorage.getItem('dte-roomfavs'),
            roomFavs = (roomFavsStr !== null && roomFavsStr.length >= 1) ? roomFavsStr.split(',') : [],
            roomIndex = roomFavs.indexOf(Dubtrack.room.model.get('roomUrl'));
        if(roomIndex >= 0) {
            roomFavEl.attr('title', 'Add Room to Favorites');
            roomFavs.splice(roomIndex, 1);
        } else {
            roomFavEl.attr('title', 'Favorited!');
            roomFavs.push(Dubtrack.room.model.get('roomUrl'));
        }
        localStorage.setItem('dte-roomfavs', roomFavs);
        roomFavEl.toggleClass('active');
    });
    if(roomFavsStr && roomFavsStr.split(',').indexOf(Dubtrack.room.model.get('roomUrl')) >= 0) {
        roomFavEl.attr('title', 'Favorited!');
        roomFavEl.toggleClass('active');
    }

    var appendRoomFavs = function() { // TODO Fix D:
        var roomFavStr = localStorage.getItem('dte-roomfavs');
        if(roomFavStr === null || roomFavStr.length === 0) return;

        var waitLoad_last = -1;
        var waitLoad = setInterval(function() {
            if(Dubtrack.roomList.collection.length === waitLoad_last) clearInterval(waitLoad);
            else {
                waitLoad_last = Dubtrack.roomList.collection.length;
                return;
            }

            roomFavStr.split(',').forEach(function(roomUrl) {
                $.getJSON('https://api.dubtrack.fm/room/term/' + roomUrl)
                    .success(function(data) {
                        var room = data.data[0],
                            imgUrl = room.currentSong ? 'https://api.dubtrack.fm/song/' + room.currentSong.songid + '/image/large' : 'https://api.dubtrack.fm/room/' + room._id + '/image/thumbnail',
                            joinMethod = (Dubtrack.room.model.get('roomUrl') === roomUrl ? 'onclick="Dubtrack.app.navigate(\'join/' + roomUrl + '\', { trigger: true, id: \'' + roomUrl + '\' })"' : ('href="/join/' + roomUrl));
                        $(['<section class="room-item userFav">',
                            '<figure class="roomImage">',
                            '<img src="' + imgUrl + '" alt="">',
                            '<a class="join" ' + joinMethod + '"><span>TUNE IN</span></a>',
                            '</figure>',
                            '<div class="user-count">',
                            (room.activeUsers >= 1 ? '<span class="icon-people"></span>' + room.activeUsers : ''),
                            '</div>',
                            '<header>',
                            '<div class="description">',
                            '<span class="name">' + room.name + '</span>',
                            '</div>',
                            '<div class="user-info" style="display: block;">',
                            '<div class="room-user">hosted by <a href="' + room._user.username + '" class="navigate">' + room._user.username + '</a></div>',
                            '</div>',
                            '</header>',
                            '<span class="current-song">' + (room.currentSong ? room.currentSong.name : 'Go ahead, play a song!') + '</span>',
                            '</section>'
                        ].join('')).prependTo('#container-room-list');
                    }).error(function(err) { console.log('Dubtrack-Extras [Lite] → Error loading favorited room with URL ' + roomUrl) });
            });
        }, 1000);
    };
    if(location.pathname === '/lobby') appendRoomFavs();
    $('#header-global .header-left-navigation .lobby-link').click(function() { if(!atLobby) appendRoomFavs(); });

    // > Chat Options < \\
    var chatOptions = $('#chat .chat-options'), buttonsSection;
    $('<span class="chat-option-header">Dubtrack Extras Lite</span>').appendTo(chatOptions);
    buttonsSection = $('<div class="chat-option-buttons chat-option-buttons-dtelite"></div>').appendTo(chatOptions);

    function appendToggle(name, displayname, variableName, storageName, description, action) {
        var toggleBtnEl = $([
            '<div class="' + name + 'Toggle">',
            '<span class="toggleIcon"></span>',
            '<span class="toggleText" title="' + description + '">' + displayname + '</span>',
            '</div>',
        ].join('')).appendTo(buttonsSection);
        var toggleStr = localStorage.getItem('dte-' + storageName);
        if(typeof(toggleStr) === 'undefined') {
            localStorage.setItem('dte-' + storageName, true);
            toggleStr = 'true';
        } else DTELite[variableName] = toggleStr === 'true';
        toggleBtnEl.click(function(e) {
            var bool = localStorage.getItem('dte-' + storageName) === 'true';
            DTELite[variableName] = !bool;
            localStorage.setItem('dte-' + storageName, DTELite[variableName]);
            toggleBtnEl.toggleClass('active');
            if(action) action(DTELite[variableName]);
        });
        if(DTELite[variableName]) {
            toggleBtnEl.toggleClass('active');
            if(action) action(true);
        }
    }
    function appendButton(name, realname, description, style, action) {
        var btnEl = $('<span class="' + name + 'Btn" style="' + style + '" title="' + description + '">' + realname + '</span>').appendTo(buttonsSection);
        btnEl.click(action);
    }

    /* Toggles */
    appendToggle(
        'boothNotification',
        'Inform when reached booth',
        'boothNotificationBool',
        'boothnotification',
        'If enabled, you\'ll get a notification everytime your song starts playing.'
    );
    appendToggle(
        'roomSettings',
        'Enable Room Custom Settings',
        'roomSettingsBool',
        'roomsettings_' + Dubtrack.room.model.id,
        'If enabled, settings defined for the room will be applied.',
        function(val) {
            if(val) DTELite.halp.loadRoomSettings();
            else DTELite.halp.hideRoomSettingsEls();
        }
    );
    appendToggle(
        'hideSkip',
        'Hide Skip Button',
        'hideSkipBool',
        'hideskip',
        'Hide the Skip Button for accidental pressing.',
        function(val) {
            if(val) $('head').append('<style id="dte-hide_skip">#main_player .player_header .skip-el { display: none !important; }</style>');
            else $('#dte-hide_skip').remove();
        }
    );

    /* Buttons */
    appendButton(
        'reloadCustomCSS',
        'Reload Custom Stylesheet (CSS)',
        'Reload DubX Custom CSS',
        'width: 33%; min-height: 66px;',
        function(e) {
            var saved = [], targetEl = $(e.target);
            if(localStorage.getItem('css')) saved.push($('head .css_import').get()[0].outerHTML);
            if(options.let_css) saved.push($('head .css_world').get()[0].outerHTML);
            if(!targetEl.hasClass('loading')) targetEl.toggleClass('loading');
            $('head .css_import, head .css_world').remove();
            setTimeout(function() {
                $('head').append(saved.join('\n'));
                targetEl.toggleClass('loading');
            }, 1000);
        }
    );
    appendButton(
        'reloadCustomBg',
        'Reload Custom Background',
        'Reload DubX Custom Background',
        'width: 33%; min-height: 66px;',
        function(e) {
            var saved = $('body .medium').get()[0].outerHTML,
                targetEl = $(e.target);
            $('body .medium').remove();
            if(!targetEl.hasClass('loading')) targetEl.toggleClass('loading');
            setTimeout(function() {
                $('body').append(saved);
                targetEl.toggleClass('loading');
            }, 1000);
        }
    );
    appendButton(
        'reloadRoomSettings',
        'Reload Room Custom Settings',
        'Reload Dubtrack Extras Room Custom Settings',
        'width: 33%; min-height: 66px;',
        function(e) {
            var targetEl = $(e.target);
            if(!targetEl.hasClass('loading')) targetEl.toggleClass('loading');
            DTELite.halp.loadRoomSettings(function() { targetEl.toggleClass('loading'); });
        }
    );

    // > Miscellaneous < \\
    DTELite.nsfwDialogBoxEl = $('<div class="nsfw-dialogbox">This link seems to be NSFW</div>').appendTo('body');
    DTELite.nsfwDialogBoxEl.hide();

    DTELite.startUpPopupEl = $([
        '<div id="dte-lite_popup">',
            'Dubtrack-Extras [Lite]',
            '<br/>',
            'is now enabled',
        '</div>'
    ].join('')).appendTo('body');
};
var fileReader;
DTELite.renderImgurUpload = function() {
    var fileUploadEl = $('.fileinput-button').css('display', 'block'),
        fileInputEl = fileUploadEl.children('#fileupload');

    fileInputEl.change(function() {
        var file = fileInputEl.prop('files')[0];
        fileReader = new FileReader(file);

        fileReader.onloadend = function(e) {
            fileReader.onloadend = null;
            if(/image\/(png|jpeg|jpg|gif)/.test(file.type)) {
                var imgB64 = e.target.result.split(',')[1];
                console.log(e.target.result);
                $.ajax({
                    url: 'https://api.imgur.com/3/upload.json',
                    type: 'POST',
                    data: {
                        type: 'base64',
                        image: imgB64,
                        key: '7848f2eed9f68bb98f9173b70b7467b0ea6887b2'
                    },
                    success: function(data) {
                        console.log('POST CALLBACK:', data);
                    },
                    error: function(x) { console.log('POST ERROR:', x) }
                })
            }
        }
        fileReader.readAsDataURL(file);
    });
}
DTELite.init = setInterval(function() {
    if(location.pathname === '/imgur/index.html' && document.readyState === 'complete') {
        clearTimeout(DTELite.init);
        //DTELite.renderImgurUpload(); TODO
        console.log('Dubtrack Extras [Imgur Upload Popup] → Started');
        return;
    }
    if(typeof(Dubtrack) === 'undefined') return;
    else if(typeof(hello) === 'undefined') return; // DubX
    else if(!Dubtrack.room) return;
    else if(!Dubtrack.room.chat) return;
    else if(!Dubtrack.room.player) return;
    else if(!Dubtrack.room.users) return;
    else {
        if(!DTELite.lastUserCount) DTELite.lastUserCount = -1;
        if(Dubtrack.room.users.collection.length !== DTELite.lastUserCount) {
            DTELite.lastUserCount = Dubtrack.room.users.collection.length;
            return;
        }
    }
    clearInterval(DTELite.init);
    console.log('Dubtrack Extras [Lite] → Loading...');
    var loadTime = Date.now();

    Dubtrack.Events.bind('realtime:room_playlist-update', function(data) {
        if(!Dubtrack.loggedIn) return;
        var song = Dubtrack.room.player.activeSong;
        if(!song) return;
        if(song.get('song').songid === DTELite.lastSongID) return;
        else DTELite.lastSongID = song.get('song').songid;
        if(song.get('song').userid === Dubtrack.session.id && DTELite.boothNotificationBool) {
            $('<li class="system my_song">You\'re the DJ right now!</li>').appendTo('#chat .chat-messages .chat-main');
            Dubtrack.room.chat.mentionChatSound.play();
        }
    });

    $('.pusher-chat-widget-input').on('keydown', '#chat-txt-message', function(e) {
        var inputEl = $('#chat-txt-message'),
            msg = inputEl.val(),
            key = e.keyCode | e.which;

        switch(key) {
            case 13: // ENTER
                if(msg.trim().length <= 0) return;
                if(DTELite.savedMsgs[DTELite.savedMsgs.length - 1] !== msg)  DTELite.savedMsgs.push(msg);
                DTELite.currentMsg = undefined;
                DTELite.msgSwitchIndex = DTELite.savedMsgs.length;
                break;
            case 38: // UP
                e.preventDefault();
                if(DTELite.savedMsgs.length > 0) {
                    if(DTELite.msgSwitchIndex === DTELite.savedMsgs.length) DTELite.currentMsg = msg;
                    DTELite.msgSwitchIndex--;
                    if(DTELite.msgSwitchIndex < 0) DTELite.msgSwitchIndex = 0;
                    msg = DTELite.savedMsgs[DTELite.msgSwitchIndex];
                }
                break;
            case 40: // DOWN
                e.preventDefault();
                DTELite.msgSwitchIndex++;
                if(DTELite.msgSwitchIndex >= DTELite.savedMsgs.length) {
                    DTELite.msgSwitchIndex = DTELite.savedMsgs.length;
                    msg = DTELite.currentMsg;
                } else msg = DTELite.savedMsgs[DTELite.msgSwitchIndex];
                break;
        }
        if(inputEl.val() !== msg) inputEl.val(msg);
    });

    Dubtrack.Events.bind('realtime:chat-message', function(data) {
        if(data.type !== 'chat-message') return;
        if(!DTELite.roomSettings.enabled) return;
        if(!DTELite.roomSettings.emotes) return;

        var msgEl = $('#chat .chat-main .activity-row .text p').last(), msgHtml;
        if(!msgEl) return;
        msgHtml = msgEl.html();
        DTELite.roomSettings.emotes.forEach(function(em) {
            msgHtml = msgHtml.replace(
                new RegExp(':' + em.regex + ':'),
                '<img class="emoji twitch-emoji" title="' + em.regex + '" alt="' + em.regex + '" src="' + em.url + '">'
            );
        });
        msgEl.html(msgHtml);

        // NSFW Tag
        if(/nsfw/gi.test(data.message) && /(http|https)(\:\/\/)([^ ]+)/gi.test(data.message)) {
            var allLinks = msgEl.find('a.autolink');
            allLinks.mouseleave(function(e) { DTELite.nsfwDialogBoxEl.hide(); });
            allLinks.mouseover(function(e) {
                var targetEl = $(e.target);
                DTELite.nsfwDialogBoxEl.show();
                DTELite.nsfwDialogBoxEl.offset({
                    top: targetEl.offset().top - DTELite.nsfwDialogBoxEl.outerHeight() - 8,
                    left: targetEl.offset().left + (targetEl.width() - DTELite.nsfwDialogBoxEl.width()) / 2
                });
            });
        }
    });

    var lastPress = Date.now();
    $(document).bind('keypress.key32', function(e) {
        var keyCode = e.keyCode | e.which, tag = e.target.tagName;
        if(tag === 'INPUT' || tag === 'TEXTAREA') return;
        var isUpdub = keyCode === 43 ? true : (keyCode === 45 ? false : undefined);
        if(typeof(isUpdub) === 'undefined') return;
        var key = 'last' + (isUpdub ? 'plus' : 'dash');
        if((!DTELite[key]) || (DTELite[key] + 35 > Date.now() && DTELite[key] + 300 < Date.now())) {
            DTELite[key] = Date.now();
            return;
        }
        DTELite[key] = undefined;
        if(isUpdub) Dubtrack.playerController.voteUpAction();
        else Dubtrack.playerController.voteDownAction();
    });

    DTELite.halp = { };
    DTELite.halp.loadRoomSettings = function(done) {
        var url = Dubtrack.room.model.get('description').match(/(@dte_roomsettings=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/);
        if(url === null) {
            if(done) done(false);
            return;
        }
        else url = url[2];
        hello.getJSON(url).done(function(data) { // thanks DubX devs ^-^
            try {
                DTELite.roomSettings = JSON.parse(data);
                if(done) done(true);
            } catch(x) {
                console.log('Dubtrack Extras [Lite] → Error loading Room Settings!');
                console.log(x);
                if(done) done(false);
            }
            DTELite.roomSettings.enabled = true;
        });
    };

    Dubtrack.app.navigateAlt = Dubtrack.app.navigate;
    Dubtrack.app.navigate = function(url, params) {
        Dubtrack.app.navigateAlt(url, params);
        atLobby = url === 'join'
    }

    DTELite.render();
    console.log('Dubtrack Extras [Lite] → Started in ' + (Date.now() - loadTime) + ' miliseconds!');
}, 100);

console.log('AGH');