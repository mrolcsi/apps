/**
 * Created by Roland on 2015.03.05..
 */

var musicStorage;

var $audio;
var $elapsedTime;
var $remainingTime;
var $progressBar;

$(document).ready(function () {
    //globals
    musicStorage = navigator.getDeviceStorage('music');

    $audio = document.getElementById("currentSong");
    $elapsedTime = $("#elapsedTime");
    $remainingTime = $("#remainingTime");
    $progressBar = $("#progress");

    //noinspection JSSuspiciousNameCombination
    //set cover art dimensions
    var $coverArt = $('#coverArt');
    var cw = $coverArt.width();
    $coverArt.css({'height': cw + 'px'});

    //set events
    $("#playPause").click(playPause);

    //get which song to load
    var param = location.search.split('filename=')[1];
    console.log("file = " + decodeURIComponent(param));

    //get file
    var request = musicStorage.get(decodeURIComponent(param));
    request.onsuccess = function () {
        var musicFile = this.result;
        console.log("File loaded.");

        $("#currentSong").attr("src", URL.createObjectURL(musicFile));

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
})
;

function printMetadata(metadata) {
    $("#title").html("<b>" + metadata.title + "</b>");
    $("#artistAlbum").text(metadata.artist + " - " + metadata.album);

    $remainingTime.text("-" + formatDuration($audio.duration));
}

function playPause() {
    console.log("> playPause onClick <");

    if ($audio.paused) {
        $audio.play();
        $("#playPause").attr("src", "/img/player_pause.png");
    } else {
        $audio.pause();
        $("#playPause").attr("src", "/img/player_play.png");
    }
}

function seek() {
    //TODO
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