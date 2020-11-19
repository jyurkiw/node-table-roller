"use strict";
exports.__esModule = true;
exports.Roller = void 0;
var rollPlan_store_1 = require("./rollPlan-store");
var table_store_1 = require("./table-store");
var SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);
var SubstituteRe = RegExp(/\{(?<name>\w*)\}/);
var Roller = (function () {
    function Roller() {
        this.rollPlans = new rollPlan_store_1.RollPlanStore();
        this.tables = new table_store_1.TableStore();
    }
    Roller.prototype.addTable = function (table) {
        this.tables.add(table);
    };
    Roller.prototype.addTables = function (tables) {
        this.tables.addm(tables);
    };
    Roller.prototype.addRollPlan = function (plan) {
        this.rollPlans.add(plan);
    };
    Roller.prototype.addRollPlans = function (plans) {
        this.rollPlans.addm(plans);
    };
    Roller.prototype.roll = function () {
    };
    Roller.prototype.between = function (a, roll, b) {
        return a.weightedIndex < roll && b.weightedIndex > roll;
    };
    Roller.prototype.executeSubstitutions = function (value, substitutions) {
        for (var _i = 0, substitutions_1 = substitutions; _i < substitutions_1.length; _i++) {
            var substitution = substitutions_1[_i];
            value = value.replace(SubstituteRe, substitution);
        }
        return value;
    };
    return Roller;
}());
exports.Roller = Roller;
//# sourceMappingURL=roller.js.map