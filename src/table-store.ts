import { TableReference } from './interfaces/TableReference';
import { Table } from './interfaces/Table';
import { TableRow, DeepCopyTableRow } from './interfaces/TableRow';
import { Store } from './store'

import * as Linq from 'linq';

const SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);

export class TableStore extends Store<Table> {
    constructor() { super(); }

    /**
     * Add a table to the table store.
     * Reference tables must be added after the tables they reference.
     * @param table Table to add.
     */
    add(table: Table): boolean {
        if (!super.add(table)) { return false; }
        this.processTable(table);
        return true;
    }

    /**
     * Process tables to fill in calculated values.
     * Should be called after all tables have been added.
     * Calculated Values:
     * <ul>
     *  <li>Weighted Index values.</li>
     * </ul>
     * @param table The table to be processed.
     */
    processTable(table: Table): boolean {
        // Calculate table references
        this.calculateTableReferences(table);

        // Calculate weighted index values
        this.calculateWeightedIndexValues(table);

        // Calculate row substitutions
        this.calculateRowSubstitutions(table);

        return true;
    }

    /**
     * Recursively handle table references.
     *   Copy referenced table data to the passed table according
     * to the reference min and max.
     *   All table rows are deep copies so that weightedIndices can
     * be calculated without changing the indices of the referenced
     * table.
     *   If the referenced table is also a reference, recursively
     * handle the reference table.
     *   Delete the passed table's reference object so that it won't
     * be handled again.
     * @param table The table to calculate references for.
     */
    calculateTableReferences(table: Table): Table {
        if (!table.reference) { return; }

        let referenceTarget: Table = super.get(table.reference.table);
        if (referenceTarget.reference) {
            this.calculateTableReferences(referenceTarget);
        }

        table.data = [];
        let rows: TableRow[] = referenceTarget.data;
        rows = rows.slice(table.reference.min, table.reference.max + 1);
        for (let row of rows) {
            table.data.push(DeepCopyTableRow(row));
        }
        delete(table.reference);
        return table;
    }

    /**
     * Calculate weighted index values.
     *   A weighted index value is the weight of the row divided
     * by the table's total weight.
     * @param table The table to calculate.
     */
    calculateWeightedIndexValues(table: Table): Table {
        // Calculate table weight
        let totalWeight:number = 0;
        Linq.from(table.data).forEach(i=>totalWeight += i.weight);
        
        // Calculate WeightedIndex values
        let runningWeight: number = 0;
        Linq.from(table.data).forEach(i=> {
            runningWeight += i.weight / totalWeight;
            i.weightedIndex = runningWeight;
        });
        // Fix for cumulative floating point math errors
        // (the last weighted Index will almost never be equal to 1).
        table.data[table.data.length - 1].weightedIndex = 1;
        return table;
    }

    /**
     * Calculate row substitutions.
     *   Substitutions are a list of table names from the value of the row.
     *   A substitution is delimited in a value string by curley braces {}.
     * The braces contain the table name. The string array contains
     * substitutions in order.
     * @param table The table to calculate.
     */
    calculateRowSubstitutions(table: Table): Table {
        if (!table.substitutions || !table.data) return table;

        let search: RegExpExecArray;
        for (let idx in table.data) {
            let row = table.data[idx] as TableRow;
            row.substitutions = [];
            while((search = SubstituteRe_Search.exec(row.value)) != null) {
                if (search.groups) {
                    row.substitutions.push(search.groups.name);
                }
            }
        }
        return table;
    }
}