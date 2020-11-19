"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.TableStore = void 0;
var store_1 = require("./store");
var Linq = require("linq");
var SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);
var TableStore = (function (_super) {
    __extends(TableStore, _super);
    function TableStore() {
        return _super.call(this) || this;
    }
    TableStore.prototype.add = function (table) {
        if (!_super.prototype.add.call(this, table)) {
            return false;
        }
        this.processTable(table);
        return true;
    };
    TableStore.prototype.processTable = function (table) {
        if (!table.data)
            return false;
        this.calculateWeightedIndexValues(table);
        return true;
    };
    TableStore.prototype.calculateWeightedIndexValues = function (table) {
        var totalWeight = 0;
        Linq.from(table.data).forEach(function (i) { return totalWeight += i.weight; });
        var runningWeight = 0;
        Linq.from(table.data).forEach(function (i) {
            runningWeight += i.weight / totalWeight;
            i.weightedIndex = runningWeight;
        });
        table.data[table.data.length - 1].weightedIndex = 1;
        return table;
    };
    TableStore.prototype.calculateRowSubstitutions = function (table) {
        if (!table.substitutions || !table.data)
            return table;
        var search = [];
        for (var idx in table.data) {
            var row = table.data[idx];
            row.substitutions = [];
            while ((search = SubstituteRe_Search.exec(row.value)) != null) {
                row.substitutions.push(search.groups.name);
            }
        }
        return table;
    };
    return TableStore;
}(store_1.Store));
exports.TableStore = TableStore;
//# sourceMappingURL=table-store.js.map