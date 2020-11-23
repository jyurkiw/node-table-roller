"use strict";
exports.__esModule = true;
exports.DeepCopyTableRow = void 0;
function DeepCopyTableRow(row) {
    var r = { value: row.value, weight: row.weight };
    if (row.weightedIndex) {
        r.weightedIndex = row.weightedIndex;
    }
    if (row.substitutions) {
        r.substitutions = row.substitutions.slice();
    }
    return r;
}
exports.DeepCopyTableRow = DeepCopyTableRow;
//# sourceMappingURL=TableRow.js.map