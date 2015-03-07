/**
 * Created by Roland on 2015.03.05..
 */

$(document).ready(function () {
    //noinspection JSSuspiciousNameCombination
    //set cover art dimensions
    var $coverArt = $('#coverArt');
    var cw = $coverArt.width();
    $coverArt.css({'height': cw + 'px'});

    //set events
    $("#playPause").click(playPause);

    //get which song to load
    var param = location.search.split('song=')[1];
    console.log("song = " + param);

    //load song
    if (param == "pompeii") {
        loadPompeii()
    } else if (param == "vivalavida") {
        loadVivaLaVida()
    } else if (param == "clarity") {
        loadClarity()
    }
});

function loadPompeii() {
    $("#coverArt").css("background-image", "url('/img/covers/pompeii.jpg')");
    $("#title").text("Pompeii");
    $("#artistAlbum").text("Bastille - Pompeii");

    $("#currentSong").attr("src", "/music/bastille-pompeii.mp3");
}
function loadVivaLaVida() {
    $("#coverArt").css("background-image", "url('/img/covers/vivalavida.jpg')");
    $("#title").text("Viva la Vida");
    $("#artistAlbum").text("Coldplay - Viva la Vida");

    $("#currentSong").attr("src", "/music/coldplay-vivalavida.mp3");
}
function loadClarity() {
    $("#coverArt").css("background-image", "url('/img/covers/clarity.jpg')");
    $("#title").text("Clarity (feat. Foxes)");
    $("#artistAlbum").text("Zedd - Clarity (Deluxe Edition)");

    $("#currentSong").attr("src", "/music/zedd-clarity.mp3");
}

function playPause() {
    console.log("> playPause onClick <");

    var audio = document.getElementById("currentSong");

    if (audio.paused) {
        audio.play();
    } else audio.pause();
}

function seek() {
    //TODO
}