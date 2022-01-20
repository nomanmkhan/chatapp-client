export function readCookie(name) {
    var nameC = name + "=";
    var cook = document.cookie.split(";");
    for (var i = 0; i < cook.length; i++) {
        var c = cook[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1, c.length)
        } if (c.indexOf(nameC) === 0) {
            c = decodeURIComponent(c.substring(nameC.length, c.length));
            return c
        }
    }
}