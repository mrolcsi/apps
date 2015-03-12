/**
 * Created by Roland on 2015.03.11..
 */

const MUSIC_FOLDER = "/sdcard/Music";

var musicStorage;
var $ulFileList;

$(document).ready(function () {
    musicStorage = navigator.getDeviceStorage('music');
    $ulFileList = $("#fileList");

    var cursor = musicStorage.enumerate();

    cursor.onsuccess = function () {
        var file = this.result;
        console.log("File found: " + file.name);

        if (file.name.lastIndexOf(MUSIC_FOLDER, 0) === 0) {
            //if the file is actually in the music folder
            console.log("+ valid file: " + file.name);

            id3(file, function (err, tags) {
                // tags now contains your ID3 tags
                console.log("> load tag: " + file.name);

                if (tags) {
                    addToList(file.name, tags);
                }
            });

            // D E P R E C A T E D
            //parseAudioMetadata(file, addToList, function (message) {
            //    console.log("> PARSE ERROR: " + message);
            //});
            //getThumbnailURL(file, function (url) {
            //    $("#" + encodeRFC5987ValueChars(file.name)).attr("src", url);
            //});
        }

        if (!this.done) {
            this.continue();
        }
    }
});

function addToList(url, tags) {
    /*
     <li>
     ....<img src="[thumbnailUrl]">
     ....<a href="player.html?filename=[path]">
     ........<p class="fit">
     ............<b>[Title]</b><br/>
     ............by [Artist]
     ........</p>
     ....</a>
     </li>
     */

    //create elements
    var $li = $(document.createElement("li"));

    var $img = $(document.createElement("img"));
    $img.attr("id", encodeRFC5987ValueChars(url));

    if (tags.v2.image) {
        var arrayBuffer = tags.v2.image.data;
        var bytes = new Uint8Array(arrayBuffer);
        var blob = new Blob([bytes.buffer]);

        var reader = new FileReader();
        reader.onload = function (e) {
            $img.attr("src", e.target.result);
        };
        reader.readAsDataURL(blob);
    }
    //$(img).attr("src",image);

    var $a = $(document.createElement("a"));
    $a.attr("href", "player.html?filename=" + encodeRFC5987ValueChars(url));

    var $p = $(document.createElement("p"));
    $p.addClass("fit");
    $p.html("<b>" + tags.title + "</b><br/>by <i>" + tags.artist + "</i>");

    //put elements together
    $li.append($img);
    $li.append($a);
    $a.append($p);

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