var DB_VERSION = 3;
var APP_ID = "bsik2f";
var STORE_NAME = "users";

var db;

$(document).ready(function () {
    //adatbázis lekérése
    var idb = window.indexedDB || window.mozIndexedDB;

    //db megnyitása
    var openReq = idb.open(STORE_NAME, DB_VERSION);
    openReq.onsuccess = function (e) {
        //a megnyitott db
        db = this.result;
    };
    openReq.onerror = function (e) {
        console.log("Error.");
    };
    openReq.onupgradeneeded = function (e) {
        console.log("onUpgrade");

        //a frissítendó db objektum
        db = e.currentTarget.result;

        //if (db.version < 1) {
        //új objectStore létrehozása
        db.createObjectStore(STORE_NAME, {keyPath: "email"});
        //}
    };

    $("#btnSave").click(function (e) {
        var store = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME);

        var addReq = store.add({
            //új objektum
            email: $("#email").val(),
            nick: $("#nick").val()
        });

        addReq.onsuccess = function (e) {
            //sikeres hozzáadás
            alert("Saved.");
        }
    });

    $("#btnGet").click(function () {
        navigator.id.request();
    })
});