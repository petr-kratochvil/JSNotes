
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
        var newItem = new DataItem(dataObject[i].item);
        setEvents = function (item) {
            item.addEventListener("change", function () { this.dispatchEvent("change"); }.bind(this));
            item.addEventListener("remove", function () { console.log("Deleting: "+JSON.stringify(item.item)+", index: "+this.data.indexOf(item)); this.data.splice(this.data.indexOf(item), 1); this.dispatchEvent("change"); }.bind(this) );
        }.bind(this);
        setEvents(newItem);
        this.data.push(newItem);
    }
    this.addEventListener("change", function() { this.save.bind(this); }.bind(this));
};

MainStorage.prototype = Object.create(Reactor.prototype);

MainStorage.prototype.save = function() {
    localStorage.silverArray = JSON.stringify(this.data);
};

MainStorage.prototype.new = function(item) {
    this.data.push(new DataItem(item));
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