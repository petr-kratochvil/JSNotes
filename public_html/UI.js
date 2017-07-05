/**
 * 
 * @param {type} elem
 * @param {type} storage
 * @returns {DataList}
 */
ViewDataList = function (elem, storage) {
    Reactor.call(this); // unused here so far
    this.ul = document.createElement("ul");
    this.ul.classList.add("list");
    this.items = [];
    elem.appendChild(this.ul);
    this.build(storage);
    storage.addEventListener("change", function () { this.clear(); this.build(storage); }.bind(this));
};

ViewDataList.prototype = Object.create(Reactor.prototype);

ViewDataList.prototype.clear = function() {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].unattach();
        delete this.items[i];
    }
    this.items = [];
};

ViewDataList.prototype.build = function(storage) {
    for (var i = 0; i < storage.data.length; i++) {
        var newItem = new ViewDataListItem(this.ul, storage.data[i]);
        newItem.addEventListener("view", function (data) { this.dispatchEvent("view", data); }.bind(this));
        this.items.push(newItem);
    }
};

/**
 * 
 * @param {type} elem
 * @param {type} data
 * @returns {DataListItem}
 */
ViewDataListItem = function(elem, data) {
    Reactor.call(this);
    this.elem = elem;
    this.data = data;
    this.li = document.createElement("li");
    this.li.classList.add("item");
    this.li.innerHTML = this.data.item.title;
    this.buttonDelete = document.createElement("button");
    this.buttonDelete.innerHTML = "Delete";
    this.buttonDelete.classList.add("listItemDelete");
    this.li.onclick = function () {
        this.dispatchEvent("view", this.data);
    }.bind(this);
    this.buttonDelete.onclick = function () {
        this.data.remove();
    }.bind(this);
    this.li.appendChild(this.buttonDelete);
    this.elem.appendChild(this.li);
};

ViewDataListItem.prototype = Object.create(Reactor.prototype);

ViewDataListItem.prototype.unattach = function() {
    this.elem.removeChild(this.li);
};

/**
 * 
 * @param {type} elem
 * @returns {Detail}
 */
ViewDetail = function(elem) {
    this.buttonEdit = document.createElement("button");
    this.buttonEdit.innerHTML = "edit";
    this.viewEdit = null;
    this.buttonEdit.onclick = function() {
        if (this.viewEdit === null)
            this.viewEdit = new ViewDetailEdit(elem, this.data, undefined
                , function () { this.viewEdit = null; }.bind(this));
    }.bind(this);
    this.elTitle = document.createElement("div");
    this.elTitle.classList.add("title");
    this.elShort = document.createElement("div");
    this.elShort.classList.add("short");
    this.elLong = document.createElement("div");
    this.elLong.classList.add("long");
    elem.appendChild(this.buttonEdit);
    elem.appendChild(this.elTitle);
    elem.appendChild(this.elShort);
    elem.appendChild(this.elLong);
};

ViewDetail.prototype.update = function () {
    this.elTitle.innerHTML = this.data.item.title;
    this.elShort.innerHTML = this.data.item.short;
    this.elLong.innerHTML = this.data.item.long;
    if (this.data.item.title === "")
        this.buttonEdit.onclick();
};

ViewDetail.prototype.setData = function (data) {
    this.data = data;
    if (this.viewEdit !== null) {
        this.viewEdit.close();
    }
    this.update();
    this.data.addEventListener("change", this.update.bind(this));
};

ViewDetailEdit = function(elem, data, storage, callBackClose) {
    this.data = typeof data === "undefined"? null : data;
    this.storage = typeof storage === "undefined"? null : storage;
    this.elMain = document.createElement("div");
    this.elTitle = document.createElement("input");
    this.elTitle.type = "text";
    this.elTitle.value = data.item.title;
    this.elShort = document.createElement("input");
    this.elShort.type = "text";
    this.elShort.value = data.item.short;
    this.elLong = document.createElement("textarea");
    this.elLong.value = this.data.item.long;
    this.elLong.cols = 50;
    this.elLong.rows = 10;
    this.buttonSave = document.createElement("button");
    this.buttonSave.innerHTML = "Save";
    this.callBackClose = callBackClose;
    this.buttonSave.onclick = function () {
        if (this.data !== null) {
            this.data.changeItem({
                title: this.elTitle.value,
                short: this.elShort.value,
                long: this.elLong.value
            });
        } else if (this.storage !== null) {
            //this.storage.new(data);
        }
        this.close();
    }.bind(this);
    this.elMain.appendChild(this.elTitle);
    this.elMain.appendChild(this.elShort);
    this.elMain.appendChild(this.elLong);
    this.elMain.appendChild(this.buttonSave);
    elem.appendChild(this.elMain);
};

ViewDetailEdit.prototype.close = function () {
    this.elMain.parentNode.removeChild(this.elMain);
    if (typeof this.callBackClose === "function")
        this.callBackClose();
};