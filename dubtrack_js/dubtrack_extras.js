$("head").append('<style>#player-controller ul li.remove-if-iframe.display-block{border-right: 0;}li.volume-button a span.icon-volume-down:before{padding-right: 5.5px;}li.volume-button a span.icon-volume-off:before{padding-right: 9.6094px;}.noanim.volume.remove-if-iframe.display-block{border-right-width: 0;}.volume-button{cursor:pointer;-webkit-user-select:none; user-select:none; -moz-user-select:none; -ms-user-select:none;}</style>');
$("#player-controller .left ul .volume").after('<li class="volume-button"><a onclick="volumeBtn()"><span class="' + volumeClass() + '"></span></a></li>');

var volSpan = $(".volume-button a span"), lastVolume = getVolume(), volUpdate = true;

$("#volume-div a").bind('style', function() { console.log("test"); volSpan.attr("class", volumeClass()); });

setInterval(function() {
    if(!volUpdate) {
        volUpdate = true;
        return;
    }
    volSpan.attr("class", volumeClass()); 
}, 100);

function volumeBtn() {
    var isZero = getVolume() === 0;
    if(!isZero) lastVolume = getVolume();

    $("#volume-div div").css("left", isZero ? lastVolume : "0%");
    $("#volume-div a").css("left", isZero ? lastVolume : "0%");
    
    Dubtrack.room.player.setVolume(isZero ? lastVolume : 0);       // Dunno the difference
    Dubtrack.room.player.setVolumeRemote(isZero ? lastVolume : 0); // Dunno the difference
    
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
