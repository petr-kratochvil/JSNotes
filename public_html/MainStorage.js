
/**
 * 
 * @returns {MainStorage}
 */
MainStorage = function() {
    Reactor.call(this);
    var dataObject;
    this.data = [];
    try {
        dataObject = JSON.parse(localStorage.getItem('silverArray'));
    } catch (e) {
        dataObject = [];
    }
    
    for (var i = 0; i< dataObject.length; i++) {
        var newItem = new DataItem(dataObject[i]);
        this._setEvents(newItem);
        this.data.push(newItem);
    }
    this.addEventListener("change", function () { this.save(); }.bind(this));
};

MainStorage.prototype = Object.create(Reactor.prototype);

MainStorage.prototype._setEvents = function (item) {
    item.addEventListener("change", function () {
        this.dispatchEvent("change");
    }.bind(this));
    item.addEventListener("remove", function () {
        this.data.splice(this.data.indexOf(item), 1);
        this.dispatchEvent("change");
    }.bind(this));
};

MainStorage.prototype.save = function() {
    var arrayToBeSaved = [];
    for (var i = 0; i < this.data.length; i++)
        arrayToBeSaved.push(this.data[i].item);
    localStorage.silverArray = JSON.stringify(arrayToBeSaved);
};

MainStorage.prototype.new = function(item) {
    var newItem = new DataItem(item);
    this._setEvents(newItem);
    this.data.push(newItem);
    this.dispatchEvent("change");
};

MainStorage.prototype.clear = function() {
    this.data = [];
    this.dispatchEvent("change");
};

/**
 * 
 * @param {type} title
 * @param {type} short
 * @param {type} long
 * @returns {DataItem}
 */
DataItem = function(item) {
    Reactor.call(this);
    if (typeof item.title === "undefined")
        item.title = "";
    if (typeof item.short === "undefined")
        item.short = "";
    if (typeof item.long === "undefined")
        item.long = "";
    this.item = item;
};

DataItem.prototype = Object.create(Reactor.prototype);

DataItem.prototype.changeItem = function(item) {
    this.item = item;
    this.dispatchEvent("change");
};

DataItem.prototype.remove = function() {
    this.dispatchEvent("remove");
};