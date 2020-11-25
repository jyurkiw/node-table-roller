"use strict";
exports.__esModule = true;
exports.DeepCopyTable = void 0;
var TableRow_1 = require("./TableRow");
var TableReference_1 = require("./TableReference");
var Linq = require("linq");
function DeepCopyTable(table) {
    var t = { name: table.name, version: table.version };
    if (table.data) {
        t.data = Linq
            .from(table.data)
            .select(function (row) { return TableRow_1.DeepCopyTableRow(row); })
            .toArray();
    }
    if (table.reference) {
        t.reference = TableReference_1.DeepCopyTableReference(table.reference);
    }
    ;
    if (table.substitutions) {
        t.substitutions = table.substitutions;
    }
    return t;
}
exports.DeepCopyTable = DeepCopyTable;
//# sourceMappingURL=Table.js.map