/**
 * Created by Roland on 2015.03.11..
 */

const MUSIC_FOLDER = "/sdcard/Music";

var musicStorage;
var $ulFileList;

$(document).ready(function () {
    //onClick listeners
    $("#back").click(function () {
        window.history.back();
    });

//load songs
    musicStorage = navigator.getDeviceStorage('music');
    $ulFileList = $("#fileList");

    var cursor = musicStorage.enumerate();

    cursor.onsuccess = function () {
        var file = this.result;
        console.log("File found: " + file.name);

        if (file.name.lastIndexOf(MUSIC_FOLDER, 0) === 0) {
            //if the file is actually in the music folder
            console.log("+ valid file: " + file.name);

            parseAudioMetadata(file, function (metadata) {
                addToList(metadata);

                var fileinfo = {
                    name: file.name,
                    blob: file,
                    metadata: metadata
                };

                getThumbnailURL(fileinfo, function (blobUrl) {
                    var id = encodeRFC5987ValueChars(fileinfo.name);

                    var $img = document.getElementById(id);

                    if ($img) {
                        $img.src = blobUrl;
                    } else {
                        console.error("$img is null! -> id = " + id);
                    }

                    //var $img = $(id);
                    //if ($img) {
                    //    $img.attr("src", blobUrl);
                    //} else {
                    //    console.error("img is null! id = " + id);
                    //}
            });
            }, function (error) {
                console.log("> parseAudioMetadata: " + error);
            });
        }

        if (!this.done) {
            this.continue();
    }
    }
})
;

function addToList(metadata) {
    /*
     <li>
     ....<img src="[thumbnailUrl]">
     ....<p class="fit">
     ........<a href="player.html?filename=[path]">
     ............<b>[Title]</b><br/>
     ............by [Artist]
     ........</a>
     ....</p>
     </li>
     */

    //create elements
    var $li = $(document.createElement("li"));

    var $img = $(document.createElement("img"));
    $img.attr("id", encodeRFC5987ValueChars(metadata.filename));

    var $p = $(document.createElement("p"));
    $p.addClass("fit");

    var $a = $(document.createElement("a"));
    $a.attr("href", "player.html?filename=" + encodeRFC5987ValueChars(metadata.filename));
    $a.html("<b>" + metadata.title + "</b><br/>by <i>" + metadata.artist + "</i>");

    //put elements together
    $li.append($img);
    $li.append($p);
    $p.append($a);

    $ulFileList.append($li);
}

function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str).
        // Note that although RFC3986 reserves "!", RFC5987 does not,
        // so we do not need to escape it
        replace(/['()]/g, escape). // i.e., %27 %28 %29
        replace(/\*/g, '%2A').
        // The following are not required for percent-encoding per RFC5987,
        // so we can allow for a little better readability over the wire: |`^
        replace(/%(?:7C|60|5E)/g, unescape);
}