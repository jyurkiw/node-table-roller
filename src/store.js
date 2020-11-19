"use strict";
exports.__esModule = true;
exports.Store = void 0;
var Store = (function () {
    function Store() {
        this.data = {};
        this.dataNames = new Set();
    }
    Store.prototype.add = function (i) {
        if (this.has(i.name)) {
            return false;
        }
        this.data[i.name] = i;
        this.dataNames.add(i.name);
        return true;
    };
    Store.prototype.addm = function (d) {
        for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
            var i = d_1[_i];
            if (!this.add(i)) {
                throw new Error('Duplicate item: ' + i.name);
            }
        }
        return true;
    };
    Store.prototype.has = function (n) {
        return this.dataNames.has(n);
    };
    Store.prototype.size = function () {
        return this.dataNames.size;
    };
    Store.prototype.get = function (n) {
        if (this.has(n)) {
            return this.data[n];
        }
        else {
            throw new Error(n + ' does not exist.');
        }
    };
    Store.prototype.remove = function (n) {
        if (this.has(n)) {
            this.dataNames["delete"](n);
            delete (this.data[n]);
            return true;
        }
        return false;
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=store.js.map