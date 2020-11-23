"use strict";
exports.__esModule = true;
exports.Roller = void 0;
var rollPlan_store_1 = require("./rollPlan-store");
var table_store_1 = require("./table-store");
var SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);
var SubstituteRe = RegExp(/\{(?<name>\w*)\}/);
;
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
    Roller.prototype.size = function () {
        return { tables: this.tables.size(), plans: this.rollPlans.size() };
    };
    Roller.prototype.getRollNum = function (tRoll) {
        if (tRoll.numRolls)
            return tRoll.numRolls;
        if (tRoll.maxRolls && tRoll.minRolls) {
            return Math.round((tRoll.maxRolls - tRoll.minRolls) * Math.random())
                + tRoll.minRolls;
        }
        if (tRoll.maxRolls) {
            return Math.round(tRoll.maxRolls * Math.random());
        }
        return 1;
    };
    Roller.prototype.roll = function (planName, rolls) {
        var plan = this.rollPlans.get(planName);
        var results = [];
        for (var _i = 0, _a = plan.rolls; _i < _a.length; _i++) {
            var planStep = _a[_i];
            var tableName = planStep.table;
            var numRolls = this.getRollNum(planStep);
            for (var i = 0; i < numRolls; i++) {
                var resultRow = this.weightedTableRoll(tableName, rolls && rolls.length >= numRolls ?
                    rolls[i] :
                    undefined);
                results.push(this.processTableRowValue(resultRow));
            }
        }
        return results;
    };
    Roller.prototype.between = function (a, roll, b) {
        if (a != undefined && roll <= a.weightedIndex)
            return -1;
        else if (b != undefined && roll > b.weightedIndex)
            return 1;
        else
            return 0;
    };
    Roller.prototype.binarySearch = function (tableRows, targetValue) {
        var stepCount = 4;
        var index = Math.ceil(tableRows.length / 2);
        var comparison;
        while (comparison != 0) {
            comparison = this.between(tableRows[index - 1], targetValue, tableRows[index]);
            if (comparison < 0) {
                index -= Math.ceil(tableRows.length / stepCount);
            }
            else if (comparison > 0) {
                index += Math.ceil(tableRows.length / stepCount);
            }
            stepCount *= 2;
        }
        return index;
    };
    Roller.prototype.executeSubstitutions = function (value, substitutions) {
        for (var _i = 0, substitutions_1 = substitutions; _i < substitutions_1.length; _i++) {
            var substitution = substitutions_1[_i];
            value = value.replace(SubstituteRe, substitution);
        }
        return value;
    };
    Roller.prototype.processTableRowValue = function (row) {
        if (!row.substitutions)
            return row.value;
        var value = row.value;
        var substitutions = row.substitutions.slice();
        for (var i in substitutions) {
            var tr = this.weightedTableRoll(substitutions[i]);
            if (tr.substitutions)
                substitutions[i] = this.processTableRowValue(tr);
            else
                substitutions[i] = tr.value;
        }
        return this.executeSubstitutions(value, substitutions);
    };
    Roller.prototype.weightedTableRoll = function (tableName, roll) {
        var table = this.tables.get(tableName);
        if (roll == undefined || roll == null) {
            roll = Math.random();
        }
        var index = this.binarySearch(table.data, roll);
        return table.data[index];
    };
    return Roller;
}());
exports.Roller = Roller;
//# sourceMappingURL=roller.js.map