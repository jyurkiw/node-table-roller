import { Table } from './interfaces/Table';
import { TableRow } from './interfaces/TableRow';
import { Store } from './store'

import * as Linq from 'linq';

const SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);

export class TableStore extends Store<Table> {

    constructor() { super(); }

    /**
     * Add a table to the table store.
     * @param table Table to add.
     */
    add(table: Table): boolean {
        if (!super.add(table)) { return false; }
        this.processTable(table);
        return true;
    }

    /**
     * Process a table to fill in calculated values.
     * Calculated Values:
     * <ul>
     *  <li>Weighted Index values.</li>
     * </ul>
     * @param table The table to be processed.
     */
    processTable(table: Table): boolean {
        if (!table.data) return false;

        // Calculate weighted index values
        this.calculateWeightedIndexValues(table);

        // Calculate substitution plans


        return true;
    }

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

    calculateRowSubstitutions(table: Table): Table {
        if (!table.substitutions || !table.data) return table;

        let search = [];
        for (let idx in table.data) {
            let row = table.data[idx] as TableRow;
            row.substitutions = [];
            while((search = SubstituteRe_Search.exec(row.value)) != null) {
                row.substitutions.push(search.groups.name);
            }
        }

        return table;
    }
}