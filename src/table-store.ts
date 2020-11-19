import { Table } from './interfaces/Table';
import { TableData } from './interfaces/TableData';
import { MappedTableData } from './interfaces/MappedTableData';

import * as Linq from 'linq';

export class TableStore {
    tableData: MappedTableData = {};

    private tables = new Set<string>();

    constructor() { }

    /**
     * Add table data.
     * @param tableData Collection of table data.
     */
    addTableData(tableData: TableData) {
        for (let table of tableData.tables) {
            this.add(table);
        }
    }

    /**
     * Process a table to fill in calculated values.
     * Calculated Values:
     * <ul>
     *  <li>Weighted Index values.</li>
     * </ul>
     * @param table The table to be processed.
     */
    private processTable(table: Table) {
        if (!table.data) return;

        // Calculate total table weight
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
    }

    /**
     * Add a table.
     * @param table Table data.
     */
    add(table: Table) {
        this.tableData[table.name] = table;
        this.tables.add(table.name);
    }

    /**
     * Checks if this TableStore has a table with a given name.
     * @param name Table name.
     */
    has(name: string): boolean {
        return this.tables.has(name);
    }

    /**
     * Remove a table from this TableStore.
     * @param name Table name.
     */
    remove(name: string): boolean {
        if (this.has(name)) {
            this.tables.delete(name);
            return delete(this.tableData[name]);
        }
        return false;
    }
}