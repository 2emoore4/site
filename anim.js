var doc,
    fadee,
    timer,
    titlePos,
    lastFrame,
    startTime,
    requestAnimationFrame,
    currentOpacity = 0,
    precision = 0.6;

function init() {
    doc = document.getElementById("center");
    fadee = document.getElementById("subcontent");

    BrowserDetect.init();
    if (BrowserDetect.browser == "Firefox") {
        doc.style.top = vPercentToPx(38) + "px";
        fadee.style.top = vPercentToPx(41) + "px";
    }
}

function initSub() {

    doc = document.getElementById("centerSub");
    fadee = document.getElementById("subcontent");

    BrowserDetect.init();
    if (BrowserDetect.browser == "Firefox") {
        doc.style.top = vPercentToPx(38) + "px";
        fadee.style.top = vPercentToPx(45) + "px";
    }

    titlePos = 35;
    setTimeout(startAnim, 250);
}

function startAnim() {
    requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    lastFrame = window.mozAnimationStartTime || +new Date;
    requestAnimationFrame(drawTitle, doc);

    lastFrame = window.mozAnimationStartTime || +new Date;
    requestAnimationFrame(drawLinks, fadee);
}

function drawTitle(timestamp) {
    var drawStart = (timestamp || +new Date),
          delta = drawStart - lastFrame;

    doc.style.left = (titlePos -= timeToPos(titlePos)) + '%';

    lastFrame = drawStart;

    if (titlePos > 20) {
        requestAnimationFrame(drawTitle, doc);
    }
}

function timeToPos(time) {
    var a = -0.01666,
          b = 0.9213,
          c = -11.73608,
          tsquared = time * time;
    return ((a * tsquared) + (b * time) + c);
}

function drawLinks(timestamp) {
    var drawStart = (timestamp || +new Date),
          delta = drawStart - lastFrame;

    fadee.style.opacity = (currentOpacity += (delta / 300));

    lastFrame = drawStart;

    if (currentOpacity < 1) {
        requestAnimationFrame(drawLinks, fadee);
    }
}

function vPercentToPx(percent) {
    return ((percent / 100) * window.innerHeight);
}

function getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return parseInt(strValue);
}

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {   string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
               string: navigator.userAgent,
               subString: "iPhone",
               identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};