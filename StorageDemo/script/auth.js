navigator.id.watch({
    loggedInUser: null,
    onlogin: function (assertion) {

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://k-firefoxos.appspot.com/persona", true);
        var param = "assertion=" + assertion;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-length", param.length);
        xhr.setRequestHeader("Connection", "close");
        xhr.send(param); // for verification by your backend

        xhr.onreadystatechange = function () {
            try {
                data = JSON.parse(xhr.responseText);
                if (data.status === "okay") {
                    //sessionStorage.setItem("user",data.email);
                    //document.querySelector("h2").innerHTML=data.email;
                    //alert(data.email);

                    console.log(data.status);

                    getUserByEmail(data.email);
                }
            }
            catch (e) {
            }
        };
    },
    onlogout: function () {
    }
});

function getUserByEmail(email) {
    var store = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME);

    var getReq = store.get(email);

    $("#email").val(email);

    getReq.onsuccess = function (e) {
        if (this.result) {
            console.log(this.result);
            $("#nick").val(this.result.nick);
        } //else alert("Email not found.");
    }
}