var triangles_target = ".userCustomB", triangles_to = null, triangles_init = true, triangles_zIndex = -999997;

$("head").append('<style>.triangle { position: fixed; width: 0; height: 0; border-left: 1px solid transparent; border-right: 1px solid transparent; border-bottom: 2px solid black; } </style>');

function initTriangle() {
    if(triangles_to !== null) clearTimeout(triangles_to);
    if(triangles_init && $(triangles_target) !== null) {
        var width = rnd(50, 300), tr = $('<div class="triangle"></div>').appendTo($(triangles_target));
        tr.css("position", 'fixed');
        tr.css("z-index", triangles_zIndex);
        tr.css("border-bottom-width", width + 'px');
        tr.css("border-left-width", (width / 2) + 'px');
        tr.css("border-right-width", (width / 2) + 'px');
        tr.css("border-bottom-color", 'rgba(' + rnd(0, 255) + ',' + rnd(0, 255) + ',' + rnd(0, 255) + ',.6)');
        tr.css("top", $(window).height() + 'px');
        tr.css("left", rnd(0, $(window).width() - width) + 'px');

        tr.animate({ top: -width + 'px' }, rnd(250, 2000), "linear", function() { tr.remove(); });
    }
    triangles_to = window.setTimeout(initTriangle, rnd(50, 150));
}
initTriangle();

function rnd(min, max) { return Math.floor(Math.random() * (min + max)) + 1 + min; }
