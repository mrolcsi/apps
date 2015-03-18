/**
 * Created by Roland on 2015.03.18..
 */

var LRC_LINE_REGEXP = "\\[([0-9\\.:]+)](.*)";

/**
 * Downloads lyrics from server.
 * The resulting object is an array of JSON objects:
 * <pre>[ {time:double, text:string}, ... ]</pre>
 * @param metadata Metadata (usually ID3 tags) gathered by <i>parseAudioMetadata</i>
 * @param callback The function called when the lyrics are available: <i>function(lyrics)<i>
 * @param errback The function called when an error occurs during download: <i>function(errorMessage)<i>
 */
function getLyrics(metadata, callback, errback) {
    var SERVER_URL = "http://users.atw.hu/mrolcsi/lrc/get.php";

    var data = {
        artist: metadata.artist.toLocaleLowerCase(),
        title: metadata.title.toLocaleLowerCase()
    };

    console.log("Downloading started...");

    var getter = $.get(SERVER_URL, data);
    getter.done(downloadFinished);
    getter.fail(function (jqXHR, textStatus, errorThrown) {
        errback(errorThrown);
    });
}

function downloadFinished(data, callback) {
    console.log("Download finished.");

    //process lyrics
    // (fun stuff...)

    //prepare RegExp
    var regExp = new RegExp(LRC_LINE_REGEXP);

    //separate lines
    var lines = data.split("\n");
    var lyrics = [];
    var r;

    //convert good lines to json objects
    //var json = [
    //    {
    //        time: 1, //seconds in double
    //        text: "First line." //simple string
    //    },
    // ...
    //];

    for (var i in lines) {
        if (regExp.test(lines[i])) {
            r = regExp.exec(lines[i]);
            //console.log("RegExp: " + r[1] + " >> " + r[2]);

            lyrics.push({
                time: tagToSeconds(r[1]),
                text: r[2]
            });
        }
    }

    console.log("Lyrics processed > " + lyrics.length + " lines.");

    callback(lyrics);
}

function tagToSeconds(tag) {
    var seconds = 0;
    if (tag.length == 8) {
        //00:00.00
        seconds += parseInt(tag.substring(0, 2)) * 60;
        seconds += parseInt(tag.substring(3, 5));
        seconds += parseInt(tag.substring(6, 8)) / 100;
        return seconds;
    } else if (tag.length == 5) {
        //00:00
        seconds += parseInt(tag.substring(0, 2)) * 60;
        seconds += parseInt(tag.substring(3, 5));
        return seconds;
    }
}