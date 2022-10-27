class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Update {
    constructor(updateFunction, name) {
        this.updateFunction = updateFunction;
        this.name = name;
    }

    stop() {
        clearInterval(this.updateFunction);
    };
}

class ObjectWrapper {
    constructor() {
        this.content = [];
    }
}

function log(val, name, debugfunction) {
    var functionName = arguments.callee.caller ? arguments.callee.caller.name : null;

    if (functionName === null || functionName === "") {
        functionName = "Anonymous Function";
    }

    if (name !== null) {
        console.log("######## " + name + " (" + functionName + ") #############");
    }

    console.log(val);

    if (debugfunction) {
        var caller = new ObjectWrapper();
        caller.content.push(arguments.callee.caller);
        console.log(caller);
    }
}

class ProcessManager {
    constructor() {
        this.processes = [];
    }

    addProcess(process) {
        this.processes.push(process);
    }

    removeProcess(process) {
        for (var i = 0; i < this.processes.length; i++) {
            if (this.processes[i] == process) {
                clearInterval(this.processes[i].checkInterval);
                this.processes.splice(i, 1);
            }
        }
    }

    removeProcessByName(name) {
        for (var i = 0; i < this.processes.length; i++) {
            if (this.processes[i].name == name) {
                clearInterval(this.processes[i].checkInterval);
                this.processes.splice(i, 1);
                i--;
            }
        }
    }

    killAllProcesses() {
        for (var i = 0; i < this.processes.length; i++) {
            clearInterval(this.processes[i].checkInterval);
        }

        this.processes = [];
    }
}

processManager = new ProcessManager();

class AsyncInvoker {
    constructor(
        func,
        obj,
        condition,
        value,
        alternateFunc,
        interval,
        name
    ) {
        this.func = func;
        this.alternateFunc = alternateFunc;
        this.checkInterval = {};
        this.interval = interval ? interval : 200;
        this.condition = obj + " " + condition + " " + value;
        this.name = name;
    }

    start() {
        var me = this;

        this.checkInterval = setInterval(function () {
            if (condition == "is") {
                if (eval(obj) == value) {
                    processManager.removeProcess(me);
                    me.func();
                }
            } else if (condition == "not") {
                if (eval(obj) != value) {
                    processManager.removeProcess(me);
                    me.func();
                }
            }

            if (alternateFunc) {
                me.alternateFunc();
            }
        }, this.interval);
    }
}

class AsyncRepeater {
    constructor(
        func,
        obj,
        condition,
        value,
        alternateFunc,
        interval,
        name,
        number_of_executions,
        timeoutFunc
    ) {
        this.func = func;
        this.alternateFunc = alternateFunc;
        this.checkInterval = {};
        this.interval = interval ? interval : 200;
        this.condition = obj + " " + condition + " " + value;
        this.name = name;
        this.number_of_executions = number_of_executions;
        this.times = 0;
        this.timeoutFunc = timeoutFunc;
    }

    start() {
        var me = this;

        this.checkInterval = setInterval(function () {
            if (condition == "is") {
                if (eval(obj) == value) {
                    me.func();
                }
            } else if (condition == "not") {
                if (eval(obj) != value) {
                    me.func();
                }
            }

            if (alternateFunc) {
                me.alternateFunc();
            }

            if (me.number_of_executions !== null) {
                me.times++;
                if (me.times >= me.number_of_executions) {
                    processManager.removeProcess(me);
                    if (me.timeoutFunc) {
                        me.timeoutFunc();
                    }
                }
            }
        }, this.interval);
    }
}

function relativeFunction(func, obj, condition, value, alternateFunc, interval, name) {
    var asyncCheck = new AsyncInvoker(func, obj, condition, value, alternateFunc, interval, name);
    asyncCheck.start();
    processManager.addProcess(asyncCheck);
}

function relativeRepeaterFunction(func, obj, condition, value, alternateFunc,
    interval, name, number_of_executions, timeoutFunc) {
    var asyncCheck = new AsyncRepeater(
        func, obj, condition, value, alternateFunc,
        interval, name, number_of_executions, timeoutFunc);
    asyncCheck.start();
    processManager.addProcess(asyncCheck);
    return asyncCheck;
}

function headline(string, type) {
    if (type === null) {
        return "<h1>" + string + "</h1>";
    } else {
        return "<h" + type + ">" + string + "</h" + type + ">";
    }
}

function list(container, sub, type) {
    var output;

    if (type === null || type == "array") {
        var i = 0;
        if (sub === null) {
            for (i = 0; i < container.length; i++) {
                output += "<div>" + container[i] + "</div>";
            }
        } else {
            for (i = 0; i < container.length; i++) {
                output += "<div>" + container[i][sub] + "</div>";
            }
        }
    }

    if (type == "object") {
        for (var key in container) {
            if (!container.hasOwnProperty(key)) continue;
            if (container[key] !== null) {
                output += "<div>" + container[key].textContent + "</div>";
            }
        }
    }

    return output;
}

function textField(string, cssClass) {
    var output = document.createElement("textarea");

    output.innerHTML = string;
    output.className = cssClass;

    return output;
}

function stringifyObject(container) {
    var output = "";
    for (var key in container) {
        if (!container.hasOwnProperty(key)) continue;
        if (container[key] !== null) {
            output += container[key].textContent;
        }
    }

    return output;
}

function randomID() {
    return Math.random().toString().replace(".", "").slice(0, 8);
}

function cloakLink(link) {
    if (link.indexOf("?") == -1) {
        link += "?" + new Date().getTime();
    } else {
        var end = link.indexOf("?");
        link = link.slice(0, end);
    }

    return link;
}

class Cookie {
    constructor(
        cookieName,
        value,
        expirationTime
    ) {
        this.separator = "| |";
        this.equals = ":is:";
        this.expirationTime = expirationTime;
        this.name = cookieName;
        this.value = value;
    }

    write() {
        document.cookie = this.name + "=" + this.value + ';expires=' + this.expirationTime + ';path=/;SameSite=Lax';
    }

    read() {
        if (document.cookie.indexOf(this.name) != -1) {
            var cookie = document.cookie.slice(document.cookie.indexOf(this.name) + this.name.length + 1, document.cookie.length);
            if (cookie === "" || cookie === null) {
                return false;
            } else if (cookie.indexOf(";") == -1) {
                if (cookie === "") {
                    return false;
                }
                return cookie;
            } else {
                var slicedCookie = cookie.slice(0, cookie.indexOf(";"));
                if (slicedCookie === "") {
                    return false;
                }
                return slicedCookie;
            }
        } else {
            return false;
        }
    }

    remove() {
        document.cookie = this.name + '=;expires=;path=/';
    }
}

class CookieHandler {
    cookies = [];
    expirationTime = null;

    constructor() {
    }

    cookie(name) {
        for (var i = 0; i < this.cookies.length; i++) {
            if (this.cookies[i].name == name) {
                return this.cookies[i];
            }
        }

        return false;
    }

    addCookie(name, value, expirationTime) {
        if (!expirationTime) {
            expirationTime = this.expirationTime;
        }

        if (!this.cookie(name)) {
            var cookie = new Cookie(name, value, expirationTime);
            this.cookies.push(cookie);
            return cookie;
        } else {
            this.cookie(name).name = name;
            this.cookie(name).value = value;
            this.cookie(name).expirationTime = expirationTime;
            return this.cookie(name);
        }
    }

    readMultipleValueCookie(cookieName) {
        if (this.cookie(cookieName).read()) {
            var cookie = this.cookie(cookieName);
            var content = cookie.read().split(cookie.separator);
            var output = {};

            for (var i = 0; i < content.length; i++) {
                if (content[i] !== null && content[i] !== "") {
                    var pair = content[i].split(cookie.equals);
                    output[pair[0]] = pair[1];
                }
            }

            return output;
        }

        return false;
    }

    writeMultipleValueCookie(cookieName, object) {
        var cookie = this.cookie(cookieName);

        var input = "";
        for (var key in object) {
            if (!object.hasOwnProperty(key))
                continue;
            if (object[key] !== null) {
                input += key + cookie.equals + object[key] + cookie.separator;
            }
        }

        cookie.value = input;
        cookie.write();
    };

    deleteAllCookies() {
        for (var i = 0; i < this.cookies.length; i++) {
            this.cookies[i].remove();
        }
    }

    writeAllCookies() {
        for (var i = 0; i < this.cookies.length; i++) {
            this.cookies[i].write();
        }
    }
}

/* thx to Ronald Fisher and Frank Yates */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function saneDocumentURL() {
    var url = document.URL;

    if (document.URL.indexOf("?") != -1) {
        url = url.slice(0, document.URL.indexOf("?"));
    }

    if (url[url.length - 1] == '/') {
        url = url.slice(0, url.length - 1);
    }

    return url;
}

function contains(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }

    return false;
}

function positionInArray(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return i;
        }
    }
    return false;
}

/*
 * deep extend objects
 */
Object.extend = function (destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor && source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            arguments.callee(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};

function addClass(className, elementID) {
    document.getElementById(elementID).className += " " + className;
}

function removeClass(className, elementID) {
    var elementClass = document.getElementById(elementID).className;
    elementClass = elementClass.replace(" " + className, "");
    elementClass = elementClass.replace(className, "");
    document.getElementById(elementID).className = elementClass;
}

class DateAndTime {
    constructor() {
    }

    today = function () {
        return new Date();
    }

    inAYear = function () {
        var date = new Date();
        date.setYear(date.getFullYear() + 1);
        return date;
    }

    inAMonth = function () {
        var date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    }
}

var dateAndTime = new DateAndTime();
