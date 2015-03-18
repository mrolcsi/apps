/**
 * Created by Roland on 2015.03.18..
 */

const SERVER_URL = "ws://5.249.150.98:8084/FirefoxOSParty/WsChatServlet";
const APP_ID = "hu.mrolcsi.webapp.stpatrick";

var ws;
var userId;
var challengeSent = false;

$(document).ready(function () {
    $("#login").click(login);
});

function login() {
    ws = new WebSocket(SERVER_URL);
    ws.onopen = function () {
        userId = $("#username").val();

        console.log("Sending: u=" + userId);

        var login = '{"u": "' + userId + '", "n": "' + userId + '", "g": "' + APP_ID + '}';
        ws.send(login);
    };

    ws.onmessage = function (message) {
        console.log(message.data);
        json = JSON.parse(message.data);

        //kihívás küldés
        if (json["c"] != null && !challengeSent) {
            var challenge = '{"u":"' + userId + '", "g":"' + APP_ID + '", "s":"' + json['s'] + '", "p":"' + APP_ID + '"}';
            ws.send(challenge);
            challengeSent = true;
        }

        //kihívás fogadás
        if (json["p"] != null) {
            var accept = '{"g":"' + APP_ID + '", "p":"' + json['p'] + '", "u":"' + userId + '"}';
            ws.send(accept);
        }

        //játék indítása
        if (json["r"] != null) {
            var start = '{"g": "' + APP_ID + '", "p": "' + json['p'] + '", "r": "' + userId + '"}';
            ws.send(start);
        }

        if (json["v"] != null) {
            alert("Let the game begin!");
        }
    }
}