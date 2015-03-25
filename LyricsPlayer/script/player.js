/**
 * Created by Roland on 2015.03.05..
 */

//UI elements
var $audio; //simple DOM, not jQuery!
var $elapsedTime;
var $remainingTime;
var $seekBar;

var $topLine;
var $middleLine;
var $bottomLine;

//global variables
var musicStorage;
var durationSet = false;
var timeIndex = []; // [i] = time;
var lyrics = {}; //[i] = {time, text}
var time;
var index;

$(document).ready(function () {
    //globals
    musicStorage = navigator.getDeviceStorage('music');

    $audio = document.getElementById("audio");
    $elapsedTime = $("#elapsedTime");
    $remainingTime = $("#remainingTime");
    $seekBar = $("#seekBar");

    $topLine = $("#topLine");
    $middleLine = $("#middleLine");
    $bottomLine = $("#bottomLine");

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
        if (!durationSet) {
            console.log("Get duration: " + e.currentTarget.duration);
            durationSet = true;
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
                });

                getLyrics(metadata, function (result) {
                    result.forEach(function (element, index) {
                        timeIndex[index] = element.time;
                    });
                    lyrics = result;

                    $topLine.text("Success.");
                    $middleLine.text("Lyrics loaded.");
                    $bottomLine.text("Press play!")
                }, function (error) {
                    $topLine.text("Error");
                    $middleLine.text("Fetching lyrics.");
                    $bottomLine.text(error);
                });

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
    $remainingTime.text("-" + formatDuration(this.duration));
    //reset lyrics
}

function audioEventPaused() {
    //show play button
    $("#playPause").attr("src", "/img/player_play.png");
    //clearInterval(updateInterval);
}

function audioEventPlaying() {
    //show pause button
    $("#playPause").attr("src", "/img/player_pause.png");
    time = round(this.currentTime, 2);
    index = closestIndex(round(this.currentTime, 2), timeIndex);
    //updateInterval = setInterval(updateLyrics, 10);
}

function audioEventUpdate() {
    //update elapsed time
    $elapsedTime.text(formatDuration(this.currentTime));
    //update remaining time
    $remainingTime.text("-" + formatDuration(this.duration - this.currentTime));
    //update seekbar
    $seekBar.val(this.currentTime);

    console.log("time = " + round(this.currentTime, 2));
    index = closestIndex(round(this.currentTime, 2), timeIndex);
    console.log("index = " + index);

    if (index != -1) {
        $topLine.text(lyrics[Math.max(0, index - 1)].text);
        $middleLine.text(lyrics[index].text);
        $bottomLine.text(lyrics[Math.min(index + 1, lyrics.length - 1)].text);
    }
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

function round(number, decimals) {
    return +(Math.round(number + "e+" + decimals) + "e-" + decimals);
}

function bSearch(source, val, low, high) {
    if (source === '' || val === '' || low === '' || high === '') return -1;
    var first = low;
    var last = high;
    var mid = 0;
    var arr = source;

    while (first < last) {
        mid = Math.floor((first + last) / 2);

        if (arr[mid] < val) first = mid + 1;
        else last = mid;
    }

    if ((first < high) && (arr[first] === val)) return first;
    else return -1;
}

function closest(val, arr) {
    var value = val;
    var tmp = arr.slice();
    tmp.push(value);
    tmp.sort(function (a, b) {
        return a - b;
    });

    var elIndex = bSearch(tmp, val, 0, tmp.length);

    var before = (tmp[elIndex - 1] != undefined) ? tmp[elIndex - 1] : undefined;
    var after = (tmp[elIndex + 1] != undefined) ? tmp[elIndex + 1] : undefined;

    if (!!before && !!after) {
        return ((Math.abs(value - before) < Math.abs(after - value)) ? before : after);
    }
}

function closestIndex(closestTo, arr) {

    var closest = 0; //Get the highest number in arr in case it match nothing.

    for (var i = 0; i < arr.length; i++) { //Loop the array
        if (arr[i] <= closestTo && arr[i] > arr[closest]) closest = i; //Check if it's higher than your number, but lower than your closest value
    }

    return closest; // return the value
}