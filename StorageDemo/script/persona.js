/**
 * Uncompressed source can be found at https://login.persona.org/include.orig.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function () {
    var a;
    navigator.mozId ? navigator.id = navigator.mozId : function () {
        var a, b = function () {
            function f(a) {
                return Array.isArray ? Array.isArray(a) : a.constructor.toString().indexOf("Array") != -1
            }

            function e(a, b, d) {
                var e = c[b][d];
                for (var f = 0; f < e.length; f++)e[f].win === a && e.splice(f, 1);
                c[b][d].length === 0 && delete c[b][d]
            }

            function d(a, b, d, e) {
                function f(b) {
                    for (var c = 0; c < b.length; c++)if (b[c].win === a)return !0;
                    return !1
                }

                var g = !1;
                if (b === "*")for (var h in c) {
                    if (!c.hasOwnProperty(h))continue;
                    if (h === "*")continue;
                    if (typeof c[h][d] == "object") {
                        g = f(c[h][d]);
                        if (g)break
                    }
                } else c["*"] && c["*"][d] && (g = f(c["*"][d])), !g && c[b] && c[b][d] && (g = f(c[b][d]));
                if (g)throw"A channel is already bound to the same window which overlaps with origin '" + b + "' and has scope '" + d + "'";
                typeof c[b] != "object" && (c[b] = {}), typeof c[b][d] != "object" && (c[b][d] = []), c[b][d].push({
                    win: a,
                    handler: e
                })
            }

            "use strict";
            var b = Math.floor(Math.random() * 1000001), c = {}, g = {}, h = function (a) {
                try {
                    var b = JSON.parse(a.data);
                    if (typeof b != "object" || b === null)throw"malformed"
                } catch (a) {
                    return
                }
                var d = a.source, e = a.origin, f, h, i;
                if (typeof b.method == "string") {
                    var j = b.method.split("::");
                    j.length == 2 ? (f = j[0], i = j[1]) : i = b.method
                }
                typeof b.id != "undefined" && (h = b.id);
                if (typeof i == "string") {
                    var k = !1;
                    if (c[e] && c[e][f])for (var l = 0; l < c[e][f].length; l++)if (c[e][f][l].win === d) {
                        c[e][f][l].handler(e, i, b), k = !0;
                        break
                    }
                    if (!k && c["*"] && c["*"][f])for (var l = 0; l < c["*"][f].length; l++)if (c["*"][f][l].win === d) {
                        c["*"][f][l].handler(e, i, b);
                        break
                    }
                } else typeof h != "undefined" && g[h] && g[h](e, i, b)
            };
            window.addEventListener ? window.addEventListener("message", h, !1) : window.attachEvent && window.attachEvent("onmessage", h);
            return {
                build: function (c) {
                    var h = function (a) {
                        if (c.debugOutput && window.console && window.console.log) {
                            try {
                                typeof a != "string" && (a = JSON.stringify(a))
                            } catch (b) {
                            }
                            console.log("[" + k + "] " + a)
                        }
                    };
                    if (!window.postMessage)throw"jschannel cannot run this browser, no postMessage";
                    if (!window.JSON || !window.JSON.stringify || !window.JSON.parse)throw"jschannel cannot run this browser, no JSON parsing/serialization";
                    if (typeof c != "object")throw"Channel build invoked without a proper object argument";
                    if (!c.window || !c.window.postMessage)throw"Channel.build() called without a valid window argument";
                    if (window === c.window)throw"target window is same as present window -- not allowed";
                    var i = !1;
                    if (typeof c.origin == "string") {
                        var j;
                        c.origin === "*" ? i = !0 : null !== (j = c.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/)) && (c.origin = j[0].toLowerCase(), i = !0)
                    }
                    if (!i)throw"Channel.build() called with an invalid origin";
                    if (typeof c.scope != "undefined") {
                        if (typeof c.scope != "string")throw"scope, when specified, must be a string";
                        if (c.scope.split("::").length > 1)throw"scope may not contain double colons: '::'"
                    }
                    var k = function () {
                        var a = "", b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        for (var c = 0; c < 5; c++)a += b.charAt(Math.floor(Math.random() * b.length));
                        return a
                    }(), l = {}, m = {}, n = {}, o = !1, p = [], q = function (a, b, c) {
                        var d = !1, e = !1;
                        return {
                            origin: b, invoke: function (b, d) {
                                if (!n[a])throw"attempting to invoke a callback of a nonexistent transaction: " + a;
                                var e = !1;
                                for (var f = 0; f < c.length; f++)if (b === c[f]) {
                                    e = !0;
                                    break
                                }
                                if (!e)throw"request supports no such callback '" + b + "'";
                                u({id: a, callback: b, params: d})
                            }, error: function (b, c) {
                                e = !0;
                                if (!n[a])throw"error called for nonexistent message: " + a;
                                delete n[a], u({id: a, error: b, message: c})
                            }, complete: function (b) {
                                e = !0;
                                if (!n[a])throw"complete called for nonexistent message: " + a;
                                delete n[a], u({id: a, result: b})
                            }, delayReturn: function (a) {
                                typeof a == "boolean" && (d = a === !0);
                                return d
                            }, completed: function () {
                                return e
                            }
                        }
                    }, r = function (a, b, c) {
                        return window.setTimeout(function () {
                            if (m[a]) {
                                var d = "timeout (" + b + "ms) exceeded on method '" + c + "'";
                                (1, m[a].error)("timeout_error", d), delete m[a], delete g[a]
                            }
                        }, b)
                    }, s = function (b, d, e) {
                        if (typeof c.gotMessageObserver == "function")try {
                            c.gotMessageObserver(b, e)
                        } catch (i) {
                            h("gotMessageObserver() raised an exception: " + i.toString())
                        }
                        if (e.id && d) {
                            if (l[d]) {
                                var j = q(e.id, b, e.callbacks ? e.callbacks : []);
                                n[e.id] = {};
                                try {
                                    if (e.callbacks && f(e.callbacks) && e.callbacks.length > 0)for (var k = 0; k < e.callbacks.length; k++) {
                                        var o = e.callbacks[k], p = e.params, r = o.split("/");
                                        for (var s = 0; s < r.length - 1; s++) {
                                            var t = r[s];
                                            typeof p[t] != "object" && (p[t] = {}), p = p[t]
                                        }
                                        p[r[r.length - 1]] = function () {
                                            var a = o;
                                            return function (b) {
                                                return j.invoke(a, b)
                                            }
                                        }()
                                    }
                                    var u = l[d](j, e.params);
                                    !j.delayReturn() && !j.completed() && j.complete(u)
                                } catch (i) {
                                    var v = "runtime_error", w = null;
                                    typeof i == "string" ? w = i : typeof i == "object" && (i && f(i) && i.length == 2 ? (v = i[0], w = i[1]) : typeof i.error == "string" && (v = i.error, i.message ? typeof i.message == "string" ? w = i.message : i = i.message : w = ""));
                                    if (w === null)try {
                                        w = JSON.stringify(i), typeof w == "undefined" && (w = i.toString())
                                    } catch (x) {
                                        w = i.toString()
                                    }
                                    j.error(v, w)
                                }
                            }
                        } else e.id && e.callback ? !m[e.id] || !m[e.id].callbacks || !m[e.id].callbacks[e.callback] ? h("ignoring invalid callback, id:" + e.id + " (" + e.callback + ")") : m[e.id].callbacks[e.callback](e.params) : e.id ? m[e.id] ? (e.error ? (1, m[e.id].error)(e.error, e.message) : e.result !== a ? (1, m[e.id].success)(e.result) : (1, m[e.id].success)(), delete m[e.id], delete g[e.id]) : h("ignoring invalid response: " + e.id) : d && l[d] && l[d]({origin: b}, e.params)
                    };
                    d(c.window, c.origin, typeof c.scope == "string" ? c.scope : "", s);
                    var t = function (a) {
                        typeof c.scope == "string" && c.scope.length && (a = [c.scope, a].join("::"));
                        return a
                    }, u = function (a, b) {
                        if (!a)throw"postMessage called with null message";
                        var d = o ? "post  " : "queue ";
                        h(d + " message: " + JSON.stringify(a));
                        if (!b && !o)p.push(a); else {
                            if (typeof c.postMessageObserver == "function")try {
                                c.postMessageObserver(c.origin, a)
                            } catch (e) {
                                h("postMessageObserver() raised an exception: " + e.toString())
                            }
                            c.window.postMessage(JSON.stringify(a), c.origin)
                        }
                    }, v = function (a, b) {
                        h("ready msg received");
                        if (o)throw"received ready message while in ready state.  help!";
                        b === "ping" ? k += "-R" : k += "-L", w.unbind("__ready"), o = !0, h("ready msg accepted."), b === "ping" && w.notify({
                            method: "__ready",
                            params: "pong"
                        });
                        while (p.length)u(p.pop());
                        typeof c.onReady == "function" && c.onReady(w)
                    }, w = {
                        unbind: function (a) {
                            if (l[a]) {
                                if (delete l[a])return !0;
                                throw"can't delete method: " + a
                            }
                            return !1
                        }, bind: function (a, b) {
                            if (!a || typeof a != "string")throw"'method' argument to bind must be string";
                            if (!b || typeof b != "function")throw"callback missing from bind params";
                            if (l[a])throw"method '" + a + "' is already bound!";
                            l[a] = b;
                            return this
                        }, call: function (a) {
                            if (!a)throw"missing arguments to call function";
                            if (!a.method || typeof a.method != "string")throw"'method' argument to call must be string";
                            if (!a.success || typeof a.success != "function")throw"'success' callback missing from call";
                            var c = {}, d = [], e = function (a, b) {
                                if (typeof b == "object")for (var f in b) {
                                    if (!b.hasOwnProperty(f))continue;
                                    var g = a + (a.length ? "/" : "") + f;
                                    typeof b[f] == "function" ? (c[g] = b[f], d.push(g), delete b[f]) : typeof b[f] == "object" && e(g, b[f])
                                }
                            };
                            e("", a.params);
                            var f = {id: b, method: t(a.method), params: a.params};
                            d.length && (f.callbacks = d), a.timeout && r(b, a.timeout, t(a.method)), m[b] = {
                                callbacks: c,
                                error: a.error,
                                success: a.success
                            }, g[b] = s, b++, u(f)
                        }, notify: function (a) {
                            if (!a)throw"missing arguments to notify function";
                            if (!a.method || typeof a.method != "string")throw"'method' argument to notify must be string";
                            u({method: t(a.method), params: a.params})
                        }, destroy: function () {
                            e(c.window, c.origin, typeof c.scope == "string" ? c.scope : ""), window.removeEventListener ? window.removeEventListener("message", s, !1) : window.detachEvent && window.detachEvent("onmessage", s), o = !1, l = {}, n = {}, m = {}, c.origin = null, p = [], h("channel destroyed"), k = ""
                        }
                    };
                    w.bind("__ready", v), setTimeout(function () {
                    }, 0);
                    return w
                }
            }
        }();
        WinChan = function () {
            function j() {
                var a = window.location, c = window.opener.frames;
                for (var d = c.length - 1; d >= 0; d--)try {
                    if (c[d].location.protocol === window.location.protocol && c[d].location.host === window.location.host && c[d].name === b)return c[d]
                } catch (e) {
                }
                return
            }

            function i(a) {
                /^https?:\/\//.test(a) || (a = window.location.href);
                var b = /^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);
                return b ? b[1] : a
            }

            function h() {
                return window.JSON && window.JSON.stringify && window.JSON.parse && window.postMessage
            }

            function g() {
                try {
                    var a = navigator.userAgent;
                    return a.indexOf("Fennec/") != -1 || a.indexOf("Firefox/") != -1 && a.indexOf("Android") != -1
                } catch (b) {
                }
                return !1
            }

            function f() {
                var a = -1, b = navigator.userAgent;
                if (navigator.appName === "Microsoft Internet Explorer") {
                    var c = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                    c.exec(b) != null && (a = parseFloat(RegExp.$1))
                } else if (b.indexOf("Trident") > -1) {
                    var c = new RegExp("rv:([0-9]{2,2}[.0-9]{0,})");
                    c.exec(b) !== null && (a = parseFloat(RegExp.$1))
                }
                return a >= 8
            }

            function e(a, b, c) {
                a.detachEvent ? a.detachEvent("on" + b, c) : a.removeEventListener && a.removeEventListener(b, c, !1)
            }

            function d(a, b, c) {
                a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener && a.addEventListener(b, c, !1)
            }

            var b = "__winchan_relay_frame", c = "die", k = f();
            return h() ? {
                open: function (f, h) {
                    function s(a) {
                        if (a.origin === m)try {
                            var b = JSON.parse(a.data);
                            b.a === "ready" ? n.postMessage(q, m) : b.a === "error" ? (r(), h && (h(b.d), h = null)) : b.a === "response" && (r(), h && (h(null, b.d), h = null))
                        } catch (c) {
                        }
                    }

                    function r() {
                        l && document.body.removeChild(l), l = a, p && (p = clearInterval(p)), e(window, "message", s), e(window, "unload", r);
                        if (o)try {
                            o.close()
                        } catch (b) {
                            n.postMessage(c, m)
                        }
                        o = n = a
                    }

                    if (!h)throw"missing required callback argument";
                    var j;
                    f.url || (j = "missing required 'url' parameter"), f.relay_url || (j = "missing required 'relay_url' parameter"), j && setTimeout(function () {
                        h(j)
                    }, 0), f.window_name || (f.window_name = null);
                    if (!f.window_features || g())f.window_features = a;
                    var l, m = i(f.url);
                    if (m !== i(f.relay_url))return setTimeout(function () {
                        h("invalid arguments: origin of url and relay_url must match")
                    }, 0);
                    var n;
                    k && (l = document.createElement("iframe"), l.setAttribute("src", f.relay_url), l.style.display = "none", l.setAttribute("name", b), document.body.appendChild(l), n = l.contentWindow);
                    var o = window.open(f.url, f.window_name, f.window_features);
                    n || (n = o);
                    var p = setInterval(function () {
                        o && o.closed && (r(), h && (h("unknown closed window"), h = null))
                    }, 500), q = JSON.stringify({a: "request", d: f.params});
                    d(window, "unload", r), d(window, "message", s);
                    return {
                        close: r, focus: function () {
                            if (o)try {
                                o.focus()
                            } catch (a) {
                            }
                        }
                    }
                }, onOpen: function (b) {
                    function l(a) {
                        if (a.data === c)try {
                            window.close()
                        } catch (b) {
                        }
                    }

                    function i(c) {
                        var d;
                        try {
                            d = JSON.parse(c.data)
                        } catch (g) {
                        }
                        !!d && d.a === "request" && (e(window, "message", i), f = c.origin, b && setTimeout(function () {
                            b(f, d.d, function (c) {
                                b = a, h({a: "response", d: c})
                            })
                        }, 0))
                    }

                    function h(a) {
                        a = JSON.stringify(a), k ? g.doPost(a, f) : g.postMessage(a, f)
                    }

                    var f = "*", g = k ? j() : window.opener;
                    if (!g)throw"can't find relay frame";
                    d(k ? g : window, "message", i), d(k ? g : window, "message", l);
                    try {
                        h({a: "ready"})
                    } catch (m) {
                        d(g, "load", function (a) {
                            h({a: "ready"})
                        })
                    }
                    var n = function () {
                        try {
                            e(k ? g : window, "message", l)
                        } catch (c) {
                        }
                        b && h({a: "error", d: "client closed window"}), b = a;
                        try {
                            window.close()
                        } catch (d) {
                        }
                    };
                    d(window, "unload", n);
                    return {
                        detach: function () {
                            e(window, "unload", n)
                        }
                    }
                }
            } : {
                open: function (a, b, c, d) {
                    setTimeout(function () {
                        d("unsupported browser")
                    }, 0)
                }, onOpen: function (a) {
                    setTimeout(function () {
                        a("unsupported browser")
                    }, 0)
                }
            }
        }();
        var c = function () {
            function l() {
                return c
            }

            function k() {
                c = g() || h() || i() || j();
                return !c
            }

            function j() {
                if (!(window.JSON && window.JSON.stringify && window.JSON.parse))return "JSON_NOT_SUPPORTED"
            }

            function i() {
                if (!a.postMessage)return "POSTMESSAGE_NOT_SUPPORTED"
            }

            function h() {
                try {
                    var b = "localStorage"in a && a.localStorage !== null;
                    if (b)a.localStorage.setItem("test", "true"), a.localStorage.removeItem("test"); else return "LOCALSTORAGE_NOT_SUPPORTED"
                } catch (c) {
                    return "LOCALSTORAGE_DISABLED"
                }
            }

            function g() {
                return f()
            }

            function f() {
                var a = e(), b = a > -1 && a < 8;
                if (b)return "BAD_IE_VERSION"
            }

            function e() {
                var a = -1;
                if (b.appName == "Microsoft Internet Explorer") {
                    var c = b.userAgent, d = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                    d.exec(c) != null && (a = parseFloat(RegExp.$1))
                }
                return a
            }

            function d(c, d) {
                b = c, a = d
            }

            var a = window, b = navigator, c;
            return {setTestEnv: d, isSupported: k, getNoSupportReason: l}
        }();
        navigator.id || (navigator.id = {});
        if (!navigator.id.request || navigator.id._shimmed) {
            var d = "https://login.persona.org", e = navigator.userAgent, f = e.indexOf("Fennec/") != -1 || e.indexOf("Firefox/") != -1 && e.indexOf("Android") != -1, g = f ? a : "menubar=0,location=1,resizable=1,scrollbars=1,status=0,width=700,height=375", h = e.match(/CriOS/) || e.match(/Windows Phone/), i = "WATCH_NEEDED", j = "__persona_dialog", k, l = {
                login: null,
                logout: null,
                match: null,
                ready: null
            }, m, n = a;

            function o(b) {
                b !== !0;
                if (n === a)n = b; else if (n != b)throw new Error("you cannot combine the navigator.id.watch() API with navigator.id.getVerifiedEmail() or navigator.id.get()this site should instead use navigator.id.request() and navigator.id.watch()")
            }

            var p, q = !1, r = c.isSupported();

            function s(a) {
                document.addEventListener ? document.addEventListener("DOMContentLoaded", function b() {
                    document.removeEventListener("DOMContentLoaded", b), a()
                }, !1) : document.attachEvent && document.readyState && document.attachEvent("onreadystatechange", function c() {
                    var b = document.readyState;
                    if (b === "loaded" || b === "complete" || b === "interactive")document.detachEvent("onreadystatechange", c), a()
                })
            }

            function t() {
                if (!!r) {
                    var c = window.document;
                    if (!c.body) {
                        q || (s(t), q = !0);
                        return
                    }
                    try {
                        if (!p) {
                            var e = c.createElement("iframe");
                            e.style.display = "none", c.body.appendChild(e), e.src = d + "/communication_iframe", p = b.build({
                                window: e.contentWindow,
                                origin: d,
                                scope: "mozid_ni",
                                onReady: function () {
                                    p.call({
                                        method: "loaded", success: function () {
                                            l.ready && l.ready()
                                        }, error: function () {
                                        }
                                    })
                                }
                            }), p.bind("logout", function (a, b) {
                                l.logout && l.logout()
                            }), p.bind("login", function (a, b) {
                                l.login && l.login(b)
                            }), p.bind("match", function (a, b) {
                                l.match && l.match()
                            }), u(m) && p.notify({method: "loggedInUser", params: m})
                        }
                    } catch (f) {
                        p = a
                    }
                }
            }

            function u(a) {
                return typeof a != "undefined"
            }

            function v(a) {
                try {
                    console.warn(a)
                } catch (b) {
                }
            }

            function w(a, b) {
                if (u(a[b])) {
                    v(b + " has been deprecated");
                    return !0
                }
            }

            function x(a, b, c) {
                if (u(a[b]) && u(a[c]))throw new Error("you cannot supply *both* " + b + " and " + c);
                w(a, b) && (a[c] = a[b], delete a[b])
            }

            function y(a) {
                if (typeof a == "object") {
                    if (a.onlogin && typeof a.onlogin != "function" || a.onlogout && typeof a.onlogout != "function" || a.onmatch && typeof a.onmatch != "function" || a.onready && typeof a.onready != "function")throw new Error("non-function where function expected in parameters to navigator.id.watch()");
                    if (!a.onlogin)throw new Error("'onlogin' is a required argument to navigator.id.watch()");
                    if (!a.onlogout && (a.onmatch || "loggedInUser"in a))throw new Error("stateless api only allows onlogin and onready options");
                    l.login = a.onlogin || null, l.logout = a.onlogout || null, l.match = a.onmatch || null, l.ready = a.onready || null, x(a, "loggedInEmail", "loggedInUser"), m = a.loggedInUser, m === !1 && (m = null);
                    if (!z(m) && !A(m) && !B(m))throw new Error("loggedInUser is not a valid type");
                    t()
                }
            }

            function z(a) {
                return a === null
            }

            function A(a) {
                return typeof a == "undefined"
            }

            function B(a) {
                return Object.prototype.toString.apply(a) === "[object String]"
            }

            var C;

            function D() {
                var a = C;
                a === "request" && (l.logout ? a = l.ready ? "watch_with_onready" : "watch_without_onready" : a = "stateless");
                return a
            }

            function E(b) {
                function r() {
                    if (p)return p.call({
                        method: "redirect_flow", params: JSON.stringify(b), success: function () {
                            window.location = d + "/sign_in"
                        }
                    })
                }

                function n() {
                    var a = c.getNoSupportReason();
                    if (!a && !e)return i
                }

                function m() {
                    return c.isSupported() && e
                }

                w(b, "requiredEmail"), x(b, "tosURL", "termsOfService"), x(b, "privacyURL", "privacyPolicy"), b.termsOfService && !b.privacyPolicy && v("termsOfService ignored unless privacyPolicy also defined"), b.privacyPolicy && !b.termsOfService && v("privacyPolicy ignored unless termsOfService also defined"), b.rp_api = D();
                var e = !h || C === "request" || C === "auth";
                C = null, b.start_time = (new Date).getTime();
                if (k)try {
                    k.focus()
                } catch (f) {
                } else {
                    if (!m()) {
                        var o = n(), q = "unsupported_dialog";
                        o === "LOCALSTORAGE_DISABLED" ? q = "cookies_disabled" : o === i && (q = "unsupported_dialog_without_watch"), k = window.open(d + "/" + q, j, g);
                        return
                    }
                    p && p.notify({method: "dialog_running"});
                    if (h)return r();
                    k = WinChan.open({
                        url: d + "/sign_in",
                        relay_url: d + "/relay",
                        window_features: g,
                        window_name: j,
                        params: {method: "get", params: b}
                    }, function (c, d) {
                        if (p) {
                            !c && d && d.email && p.notify({method: "loggedInUser", params: d.email});
                            var e = !(c || d && d.assertion);
                            p.notify({method: "dialog_complete", params: e})
                        }
                        k = a;
                        if (!c && d && d.assertion)try {
                            l.login && l.login(d.assertion)
                        } catch (f) {
                            console.log(f);
                            throw f
                        }
                        if (c === "client closed window" || !d)b && b.oncancel && b.oncancel(), delete b.oncancel
                    })
                }
            }

            navigator.id = {
                request: function (a) {
                    if (this != navigator.id)throw new Error("all navigator.id calls must be made on the navigator.id object");
                    if (!l.login)throw new Error("navigator.id.watch must be called before navigator.id.request");
                    a = a || {}, o(!1), C = "request", a.returnTo || (a.returnTo = document.location.pathname);
                    return E(a)
                }, watch: function (a) {
                    if (this != navigator.id)throw new Error("all navigator.id calls must be made on the navigator.id object");
                    o(!1), y(a)
                }, logout: function (a) {
                    if (this != navigator.id)throw new Error("all navigator.id calls must be made on the navigator.id object");
                    t(), p && p.notify({method: "logout"}), typeof a == "function" && (v("navigator.id.logout callback argument has been deprecated."), setTimeout(a, 0))
                }, get: function (b, c) {
                    var d = {};
                    c = c || {}, d.privacyPolicy = c.privacyPolicy || a, d.termsOfService = c.termsOfService || a, d.privacyURL = c.privacyURL || a, d.tosURL = c.tosURL || a, d.siteName = c.siteName || a, d.siteLogo = c.siteLogo || a, d.backgroundColor = c.backgroundColor || a, d.experimental_emailHint = c.experimental_emailHint || a, C = C || "get";
                    w(c, "silent") ? b && setTimeout(function () {
                        b(null)
                    }, 0) : (o(!0), y({
                        onlogin: function (a) {
                            b && (b(a), b = null)
                        }, onlogout: function () {
                        }
                    }), d.oncancel = function () {
                        b && (b(null), b = null), l.login = l.logout = l.match = l.ready = null
                    }, E(d))
                }, getVerifiedEmail: function (a) {
                    v("navigator.id.getVerifiedEmail has been deprecated"), o(!0), C = "getVerifiedEmail", navigator.id.get(a)
                }, _shimmed: !0
            }
        }
    }()
})()