function Event(name) {
    this.name = name;
    this.callbacks = [];
};

Event.prototype.registerCallback = function (callback) {
    this.callbacks.push(callback);
};

function Reactor() {
    this.events = {};
}

Reactor.prototype.registerEvent = function (eventName) {
    if (this.events[eventName] === undefined)
    {
        var event = new Event(eventName);
        this.events[eventName] = event;
    }
};

Reactor.prototype.dispatchEvent = function (eventName, eventArgs) {
    if (typeof (this.events[eventName]) !== "undefined") {
        this.events[eventName].callbacks.forEach(function (callback) {
            callback(eventArgs);
        });
    }
};

Reactor.prototype.addEventListener = function (eventName, callback) {
    if (this.events[eventName] === undefined) {
        this.registerEvent(eventName);
    }
    this.events[eventName].registerCallback(callback);
};

Reactor.addEventListener = function (eventName, callback) {
    if (Reactor.events[eventName] === undefined) {
        var event = new Event(eventName);
        Reactor.events[eventName] = event;
    }
    Reactor.events[eventName].registerCallback(callback);
};