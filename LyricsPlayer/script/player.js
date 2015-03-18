/**
 * Created by Roland on 2015.03.05..
 */

var musicStorage;

var $audio; //simple DOM, not jQuery!
var $elapsedTime;
var $remainingTime;
var $seekBar;
var $durationSet = false;

$(document).ready(function () {
    //globals
    musicStorage = navigator.getDeviceStorage('music');

    $audio = document.getElementById("audio");
    $elapsedTime = $("#elapsedTime");
    $remainingTime = $("#remainingTime");
    $seekBar = $("#seekBar");
    $seekBar.val(0);

    //noinspection JSSuspiciousNameCombination
    //set cover art dimensions
    var $coverArt = $('#coverArt');
    var cw = $coverArt.width();
    $coverArt.css({'height': cw + 'px'});

    //set events
    $("#playPause").click(playPause);
    $seekBar.on("input", seek);

    //set audio events
    $audio.addEventListener("ended", audioEventEnded);
    $audio.addEventListener("pause", audioEventPaused);
    $audio.addEventListener("playing", audioEventPlaying);
    $audio.addEventListener("timeupdate", audioEventUpdate);
    $audio.addEventListener("canplaythrough", function (e) {
        if (!$durationSet) {
            console.log("Get duration: " + e.currentTarget.duration);
            $durationSet = true;
            $remainingTime.text("-" + formatDuration(e.currentTarget.duration));
            $seekBar.attr("max", e.currentTarget.duration)
        }
    });

    //get which song to load
    var param = location.search.split('filename=')[1];
    console.log("file = " + decodeURIComponent(param));

    //get file
    var request = musicStorage.get(decodeURIComponent(param));
    request.onsuccess = function () {
        var musicFile = this.result;
        console.log("File loaded.");

        $("#audio").attr("src", URL.createObjectURL(musicFile));

        parseAudioMetadata(musicFile, function (metadata) {
                console.log("Metadata loaded.");
                printMetadata(metadata);

                var fileinfo = {
                    name: musicFile.name,
                    blob: musicFile,
                    metadata: metadata
                };

                getThumbnailURL(fileinfo, function (blobUrl) {
                    console.log("Cover art loaded.");
                    var $coverArt = document.getElementById("coverArt");
                    $coverArt.style.background = "url(" + blobUrl + ")";
                    $coverArt.style.backgroundSize = "100%";
                })
            }, function (error) {
                console.error("parseAudioMetadata error: " + error)
            }
        )
    };
    request.onerror = function () {
        console.warn("Unable to get the file: " + this.error);
    };
});

function printMetadata(metadata) {
    $("#title").html("<b>" + metadata.title + "</b>");
    $("#artistAlbum").text(metadata.artist + " - " + metadata.album);
}

function playPause() {
    console.log("> playPause onClick <");

    if ($audio.paused) {
        $audio.play();
    } else {
        $audio.pause();
    }
}

function seek() {
    $audio.currentTime = $seekBar.val();
}

//audio events
function audioEventEnded() {
    //reset seekbar
    $seekBar.val("0");
    //reset elapsed time
    $elapsedTime.text(formatDuration(0));
    //reset remaining time
    $remainingTime.text("-" + formatDuration($audio.duration));
    //reset lyrics
}

function audioEventPaused() {
    //show play button
    $("#playPause").attr("src", "/img/player_play.png");
}

function audioEventPlaying() {
    //show pause button
    $("#playPause").attr("src", "/img/player_pause.png");
}

function audioEventUpdate() {
    //TODO
    //update elapsed time
    $elapsedTime.text(formatDuration($audio.currentTime));
    //update remaining time
    $remainingTime.text("-" + formatDuration($audio.duration - $audio.currentTime));
    //update seekbar
    $seekBar.val($audio.currentTime);
    //update lyrics
}

//media utils
//Format Duration
function formatDuration(duration) {
    function padLeft(num, length) {
        var r = String(num);
        while (r.length < length) {
            r = '0' + r;
        }
        return r;
    }

    duration = Math.round(duration);
    var minutes = Math.floor(duration / 60);
    var seconds = duration % 60;
    if (minutes < 60) {
        return padLeft(minutes, 2) + ':' + padLeft(seconds, 2);
    }
    var hours = Math.floor(minutes / 60);
    minutes = Math.floor(minutes % 60);
    return hours + ':' + padLeft(minutes, 2) + ':' + padLeft(seconds, 2);
}