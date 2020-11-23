import { RollPlanStore } from './rollPlan-store';
import { TableStore } from './table-store';

import { Table } from './interfaces/Table';
import { TableRow } from './interfaces/TableRow';
import { TableRoll } from './interfaces/TableRoll';
import { RollPlan } from './interfaces/RollPlan';

import * as Linq from 'linq';

const SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);
const SubstituteRe = RegExp(/\{(?<name>\w*)\}/);

export interface RollerSize { tables: number, plans: number };

export class Roller {
    private rollPlans: RollPlanStore = new RollPlanStore();
    private tables: TableStore = new TableStore();

    /**
     * Add a table to the roller.
     * @param table The table to add.
     */
    addTable(table: Table) {
        this.tables.add(table);
    }

    /**
     * Add multiple tables to the roller.
     * @param tables The tables to add.
     */
    addTables(tables: Table[]) {
        this.tables.addm(tables);
    }

    /**
     * Add a roll plan to the roller.
     * @param plan The plan to add.
     */
    addRollPlan(plan: RollPlan) {
        this.rollPlans.add(plan);
    }

    /**
     * Add multiple roll plans to the roller.
     * @param plans The plans to add.
     */
    addRollPlans(plans: RollPlan[]) {
        this.rollPlans.addm(plans);
    }

    /**
     * Returns a RollerSize object with the number of tables and plans in the roller.
     */
    size(): RollerSize {
        return { tables: this.tables.size(), plans: this.rollPlans.size() } as RollerSize;
    }

    /**
     * Return a number of rolls.
     * numRolls if present.
     * A value between min and max.
     * A value between 0 and max.
     * @param tRoll The table roll object to consider.
     */
    getRollNum(tRoll: TableRoll): number {
        if (tRoll.numRolls) return tRoll.numRolls;
        if (tRoll.maxRolls && tRoll.minRolls) {
            return Math.round(
                (tRoll.maxRolls - tRoll.minRolls) * Math.random())
                 + tRoll.minRolls;
        }
        if (tRoll.maxRolls) {
            return Math.round(tRoll.maxRolls * Math.random());
        }
        return 1;
    }

    /**
     * Execute a roll plan.
     * @param planName Name of the plan to execute.
     * @param rolls Rolls passed to the roll plan.
     */
    roll(planName: string, rolls?: number[]): string[] {
        let plan: RollPlan = this.rollPlans.get(planName);
        let results: string[] = [];

        for (let planStep of plan.rolls) {
            let tableName: string = planStep.table;
            let numRolls = this.getRollNum(planStep);
            for (let i = 0; i < numRolls; i++) {
                let resultRow: TableRow = this.weightedTableRoll(
                    tableName,
                    rolls && rolls.length >= numRolls ?
                        rolls[i] : 
                        undefined
                );
                results.push(this.processTableRowValue(resultRow));
            }
        }

        return results;
    }

    /**
     * Return -1 if roll is less than or equal to a,
     * 1 if roll is greater than b,
     * 0 otherwise.
     * @param a The low weightedIndex row.
     * @param roll The roll value.
     * @param b The high weightedIndex row.
     */
    between(a: TableRow, roll: number, b: TableRow): number {
        if (a != undefined && roll <= a.weightedIndex) return -1;
        else if (b != undefined && roll > b.weightedIndex) return 1;
        else return 0;
    }

    /**
     * Return the table row targetValue is closest less-than or equal-to.
     * EX: [1,2,3], targetValue = 1.5
     * Row returned would be 2 because 2 is the closest value to 1.5.
     * Uses between-logic.
     * @param tableRows TableRows to search.
     * @param targetValue Value to look for.
     */
    private binarySearch(tableRows: TableRow[], targetValue: number): number {
        let stepCount: number = 4;
        let index: number = Math.ceil(tableRows.length / 2);
        let comparison: number;
    
        while (comparison != 0) {
            comparison = this.between(
                tableRows[index - 1], targetValue, tableRows[index]);
    
            if (comparison < 0) {
                index -= Math.ceil(tableRows.length / stepCount);
            } else if (comparison > 0) {
                index += Math.ceil(tableRows.length / stepCount);
            }
            stepCount *= 2;
        }
        return index;
    }

    /**
     * Substitute strings into a value string according to delimited values.
     * @param value The value to perform substitutions in.
     * @param substitutions The substitution values to place into the value.
     */
    executeSubstitutions(value: string, substitutions: string[]): string {
        for(let substitution of substitutions) {
            value = value.replace(SubstituteRe, substitution);
        }
        return value;
    }

    processTableRowValue(row: TableRow): string {
        if (!row.substitutions) return row.value;

        let value = row.value;
        let substitutions: string[] = row.substitutions.slice();
        for (let i in substitutions) {
            let tr = this.weightedTableRoll(substitutions[i]);
            if (tr.substitutions) substitutions[i] = this.processTableRowValue(tr);
            else substitutions[i] = tr.value;
        }
        return this.executeSubstitutions(value, substitutions);
    }

    /**
     * Perform a weighted roll on a table.
     * @param tableName The name of the table to roll on.
     * @param roll The roll value (optional).
     */
    weightedTableRoll(tableName: string, roll?: number): TableRow {
        let table: Table = this.tables.get(tableName);
        if (roll == undefined || roll == null) { roll = Math.random(); }

        let index = this.binarySearch(table.data, roll);
        return table.data[index];
    }
}