/*
var YTImporter = {
    _googleApiKey: 'AIzaSyC0KR5RSAttkiUvn9Aran3GnLSryAld82M',
    _displayError: function(msg) {
        if(!msg) Dubtrack.helpers.displayError('Youtube Playlist importer → Internal Error', 'Check console (F12) to see error log.');
        else Dubtrack.helpers.displayError('Youtube Playlist importer → Error', msg);
    },
    _displayOutput_to: undefined,
    _displayOutput: function(msg, useTimeout) {
        if(!msg) Dubtrack.els.hideMainLoading();
        else {
            Dubtrack.els.displayloading(msg);
            if(useTimeout) {
                if(YTImporter._displayOutput_to) clearTimeout(YTImporter._displayOutput_to);
                YTImporter._displayOutput_to = setTimeout(function() { Dubtrack.els.hideMainLoading() }, 5000);
            }
        }
    },
    _fastMode: false
};

YTImporter.import = function(yt_username, yt_playlistName, playlistName) {
    $.getJSON('https://www.googleapis.com/youtube/v3/channels', { forUsername: yt_username, part: 'id', key: this._googleApiKey })
        .done(function(data) {
            if(data.pageInfo.totalResults <= 0) {
                YTImporter._displayError('No user with given youtube username was found.');
                return;
            }
            $.getJSON('https://www.googleapis.com/youtube/v3/playlists', { channelId: data.items[0].id, part: 'snippet', key: YTImporter._googleApiKey })
                .done(function(data) {
                    var foundId, foundTitle;
                    data.items.forEach(function(playlist) {
                        if(foundId && foundTitle) return;
                        if(playlist.snippet.title.toLowerCase() === yt_playlistName.toLowerCase()) {
                            foundId = playlist.id;
                            foundTitle = playlist.snippet.title;
                        }
                    });
                    if(!foundId) {
                        YTImporter._displayError('No playlist with given youtube playlist name was found.');
                        return;
                    }
                    YTImporter.importFromPlaylistId(foundId, playlistName, foundTitle);
                }).error(function(x) { YTImporter._displayError(false); console.log(x); });
        }).error(function(x) { YTImporter._displayError(false); console.log(x); });
};

// PLEGaOxpFZhNB2hneot73NarmYGjKdpN2G
// PL7kJb4R08nTgY8KA44g5zBT5BIuawdrUl
YTImporter.importFromPlaylistId = function(yt_playlistId, playlistName, yt_playlistTitle) {
    function inner() {
        var targetPlaylistId;
        function inner() {
            $.getJSON('https://www.googleapis.com/youtube/v3/playlistItems', { part: 'contentDetails', playlistId: yt_playlistId, maxResults: 50, key: YTImporter._googleApiKey })
                .done(function(data) {
                    function importAtIndex(index, callback, video) {
                        YTImporter._displayOutput('Getting next song of playlist (song #' + index + ')', false);
                        var videoid = video.contentDetails.videoId;
                        $.getJSON('https://www.googleapis.com/youtube/v3/videos', { part: 'snippet', id: videoid, key: YTImporter._googleApiKey })
                            .done(function(data) {
                                var title = data.items[0].snippet.title;
                                YTImporter._displayOutput('Importing song ' + title + '.', false);
                                $.post('https://api.dubtrack.fm/playlist/' + targetPlaylistId + '/songs', { 'fkid': videoid, 'type': 'youtube' }, null, 'json')
                                    .done(function() {
                                        YTImporter._displayOutput('Imported song ' + title + '(#' + index + ').', true);
                                        callback();
                                    }).error(function(x) { YTImporter._displayOutput('Failed to import song ' + title + '(#' + index + ').', true); console.log(x); });
                            });
                    }
                    var i = -1;
                    var importLoop = function() {
                        i++;
                        if(i >= data.items.length) {
                            YTImporter._displayOutput('Done importing to ' + playlistName + '! Reloading page to see results.', true);
                            location.reload();
                            return;
                        }
                        else importAtIndex(i, importLoop, data.items[i]);
                    };
                    importLoop();
                }).error(function(x) { YTImporter._displayError(false); console.log(x); });
        }

        if(!playlistName && !yt_playlistTitle) {
            YTImporter._displayError("Given Dubtrack Playlist name is null or undefined and so it can't be used. Please give a valid Dubtrack Playlist name to continue");
            return;
        }

        function getPlaylist() {
            Dubtrack.user.playlist.models.forEach(function(playlist) {
                if(targetPlaylistId) return;
                if(playlist.get('name').toLowerCase() === playlistName.toLowerCase()) {
                    targetPlaylistId = playlist.id;
                    YTImporter._displayOutput('Found playlists, importing from youtube...', false);
                }
            });
        }
        if(!targetPlaylistId) {
            YTImporter._displayOutput("Given Dubtrack Playlist not found. Making one...", false);
            $.post('https://api.dubtrack.fm/playlist', { name: playlistName ? playlistName : yt_playlistTitle })
                .done(function(data) { targetPlaylistId = data.data._id; inner() })
                .error(function(x) { YTImporter._displayError(false); console.log(x); });
        } else inner();
    }
    Dubtrack.app.loadUserPlaylists(inner);
};
*/

$.getScript('https://rawgit.com/Cr4fTeXe/Dubtrack-YT-Playlist-Importer/master/yt-importer.js');