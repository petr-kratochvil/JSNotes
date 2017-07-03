
/**
 * 
 * @returns {MainStorage}
 */
MainStorage = function() {
    Reactor.call(this);
    try {
        this.data = JSON.parse(localStorage.getItem('silverArray'));
    } catch (e) {
        this.data = null;
    }
    if (this.data === null)
        this.data = [];
    this.addEventListener("change", this.save.bind(this));
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