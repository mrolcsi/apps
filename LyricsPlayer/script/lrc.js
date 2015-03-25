/**
 * Created by Roland on 2015.03.18..
 */

var LRC_LINE_REGEXP = "\\[([0-9\\.:]+)](.*)";

/**
 * Downloads lyrics from server.
 * The resulting object is an array of objects:
 * <pre>[ {time:float, text:string}, ... ]</pre>
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
    getter.fail(function (jqXHR, textStatus, errorThrown) {
        errback(errorThrown);
    });

    getter.done(function (data) {
            console.log("Download finished.");

            //process timedLyrics
            // (fun stuff...)

            //prepare RegExp
            var regExp = new RegExp(LRC_LINE_REGEXP);

            //separate lines
            var lines = data.split("\n");
            var lyrics = [];
            var r;

            for (var i in lines) {
                if (regExp.test(lines[i])) {
                    r = regExp.exec(lines[i]);
                    console.log(tagToSeconds(r[1]) + ": " + r[1] + " >> " + r[2]);

                    //lyrics[tagToSeconds(r[1])] = r[2];

                    lyrics.push({
                        time: tagToSeconds(r[1]),
                        text: r[2]
                    });
                }
            }

            console.log("Lyrics processed > " + lyrics.length + " lines.");

            callback(lyrics);
        }
    );
}

function tagToSeconds(tag) {
    var seconds = 0;
    if (tag.length == 8) {
        //00:00.00
        seconds += parseInt(tag.substring(0, 2)) * 60;
        seconds += parseInt(tag.substring(3, 5));
        seconds += parseInt(tag.substring(6, 8)) / 100;
        return parseFloat(seconds);
    } else if (tag.length == 5) {
        //00:00
        seconds += parseInt(tag.substring(0, 2)) * 60;
        seconds += parseInt(tag.substring(3, 5));
        return parseFloat(seconds);
    }
}