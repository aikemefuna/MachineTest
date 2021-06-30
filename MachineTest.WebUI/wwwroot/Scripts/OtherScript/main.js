function ShowMessagePopup(caption, message, type) {
    if (type) {
        swal({ title: caption, text: message, icon: type, closeOnClickOutside: false, closeOnEsc: false }
        );
    }
    else {
        swal({ title: caption, text: message, closeOnClickOutside: false, closeOnEsc: false });
    }
};

function getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;
}

function getMonthYearDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    //var day = date.getDate().toString();
    //day = day.length > 1 ? day : '0' + day;
    return month + '/' + year;
}

function getFormattedLongDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function getMonthNameYearDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + year;
}

function getFormattedDateTime(date) {
    //var hours = date.getHours();
    //var minutes = date.getMinutes();
    //var ampm = hours >= 12 ? 'pm' : 'am';
    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    //minutes = minutes < 10 ? '0' + minutes : minutes;
    //var strTime = hours + ':' + minutes + ' ' + ampm;

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return getFormattedDate(date) + " " + strTime;
}

function amountRoundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function amountRoundUp(num, places) {
    return +(Math.round(num + "e+" + places) + "e-" + places);
}

function formatMoney(n, currency) {
    //return currency + " " + n.toFixed(2).replace(/./g, function (c, i, a) {
    //    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    //});
    return currency + "" + (amountRoundToTwo(n) + '').replace(/./g, function (c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}

function browserBack() {
    // broswer hack to disable back button
    history.pushState(null, null, location.href);
    window.addEventListener("popstate", function () {
        history.pushState(null, null, location.href);
    });
}

function removeFormat(str) {
    if (!str) return str;
    return str.replace(/[^0-9-.]/g, '');
}

function getFloatFromValue(inputValue) {
    return removeFormat(inputValue) === ''
        ? 0
        : parseFloat(removeFormat(inputValue));
}

//swal({ title: "Successful", text: response.StatusMessage, type: "success" },
//    function () {
//        var url = taxSmart.pageSettings.serverVars.curl + '/' + response.ReferenceNumber + '/' + response.ResponseObject;
//        $(location).attr('href', url);
//    });

function amountRoundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

var Base64 = (function () {
    "use strict";

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function (string) {

        var utftext = "", c, n;

        string = string.replace(/\r\n/g, "\n");

        for (n = 0; n < string.length; n++) {

            c = string.charCodeAt(n);

            if (c < 128) {

                utftext += String.fromCharCode(c);

            } else if ((c > 127) && (c < 2048)) {

                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);

            } else {

                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);

            }

        }

        return utftext;
    };

    var _utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {

                string += String.fromCharCode(c);
                i++;

            } else if ((c > 191) && (c < 224)) {

                c1 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;

            } else {

                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;

            }

        }

        return string;
    };

    var _hexEncode = function (input) {
        var output = '', i;

        for (i = 0; i < input.length; i++) {
            output += input.charCodeAt(i).toString(16);
        }

        return output;
    };

    var _hexDecode = function (input) {
        var output = '', i;

        if (input.length % 2 > 0) {
            input = '0' + input;
        }

        for (i = 0; i < input.length; i = i + 2) {
            output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
        }

        return output;
    };

    var encode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = _utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += _keyStr.charAt(enc1);
            output += _keyStr.charAt(enc2);
            output += _keyStr.charAt(enc3);
            output += _keyStr.charAt(enc4);

        }

        return output;
    };

    var decode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }

        }

        return _utf8_decode(output);
    };

    var decodeToHex = function (input) {
        return _hexEncode(decode(input));
    };

    var encodeFromHex = function (input) {
        return encode(_hexDecode(input));
    };

    return {
        'encode': encode,
        'decode': decode,
        'decodeToHex': decodeToHex,
        'encodeFromHex': encodeFromHex
    };
}());
//Ishola code above

function formatMoney(n, currency) {
    //return currency + " " + n.toFixed(2).replace(/./g, function (c, i, a) {
    //    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    //});
    return currency + "" + (amountRoundToTwo(n) + '').replace(/./g, function (c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}

Date.prototype.formatDate = function (format) {
    var date = this;
    if (!format)
        format = "MM/dd/yyyy";

    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    format = format.replace("MM", month.toString().padL(2, "0"));

    if (format.indexOf("yyyy") > -1)
        format = format.replace("yyyy", year.toString());
    else if (format.indexOf("yy") > -1)
        format = format.replace("yy", year.toString().substr(2, 2));

    format = format.replace("dd", date.getDate().toString().padL(2, "0"));

    var hours = date.getHours();
    if (format.indexOf("t") > -1) {
        if (hours > 11)
            format = format.replace("t", "pm")
        else
            format = format.replace("t", "am")
    }
    if (format.indexOf("HH") > -1)
        format = format.replace("HH", hours.toString().padL(2, "0"));
    if (format.indexOf("hh") > -1) {
        if (hours > 12) hours - 12;
        if (hours === 0) hours = 12;
        format = format.replace("hh", hours.toString().padL(2, "0"));
    }
    if (format.indexOf("mm") > -1)
        format = format.replace("mm", date.getMinutes().toString().padL(2, "0"));
    if (format.indexOf("ss") > -1)
        format = format.replace("ss", date.getSeconds().toString().padL(2, "0"));
    return format;
};

//function ajaxLoading() {
//    //console.log('ajax loading');
//    $(document)
//        .ajaxStart(function () {
//            //$("#ajaxSpinnerImage").show();
//            $.blockUI({ message: $('#loader') });
//        }).ajaxError(function () {
//            //$("#ajaxSpinnerImage").hide();
//            $.unblockUI();
//        }).ajaxStop(function () {
//            //$("#ajaxSpinnerImage").hide();
//            $.unblockUI();
//        });
//}


String.repeat = function (chr, count) {
    var str = "";
    for (var x = 0; x < count; x++) { str += chr };
    return str;
}
String.prototype.padL = function (width, pad) {
    if (!width || width < 1)
        return this;

    if (!pad) pad = " ";
    var length = width - this.length
    if (length < 1) return this.substr(0, width);

    return (String.repeat(pad, length) + this).substr(0, width);
}
String.prototype.padR = function (width, pad) {
    if (!width || width < 1)
        return this;

    if (!pad) pad = " ";
    var length = width - this.length
    if (length < 1) this.substr(0, width);

    return (this + String.repeat(pad, length)).substr(0, width);
}

var tSmart = tSmart || {};

(function ($) {
    /* Application paths *****************************************/

    //Current application root path (including virtual directory if exists).
    tSmart.appPath = tSmart.appPath || '/';

    tSmart.pageLoadTime = new Date();

    //Converts given path to absolute path using tSmart.appPath variable.
    tSmart.toAbsAppPath = function (path) {
        if (path.indexOf('/') === 0) {
            path = path.substring(1);
        }

        return tSmart.appPath + path;
    };


    //ajaxLoading();

})(jQuery);
