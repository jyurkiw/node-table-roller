import { RollPlanStore } from './rollPlan-store';
import { TableStore } from './table-store';

import { Table } from './interfaces/Table';
import { TableRow } from './interfaces/TableRow';
import { RollPlan } from './interfaces/RollPlan';

const SubstituteRe_Search = RegExp(/[\w\s]*\{(?<name>\w*)\}/y);
const SubstituteRe = RegExp(/\{(?<name>\w*)\}/);

export class Roller {
    private rollPlans: RollPlanStore = new RollPlanStore();
    private tables: TableStore = new TableStore();

    addTable(table: Table) {
        this.tables.add(table);
    }
    addTables(tables: Table[]) {
        this.tables.addm(tables);
    }
    addRollPlan(plan: RollPlan) {
        this.rollPlans.add(plan);
    }
    addRollPlans(plans: RollPlan[]) {
        this.rollPlans.addm(plans);
    }

    roll() {

    }

    between(a: TableRow, roll: number, b: TableRow): boolean {
        return a.weightedIndex < roll && b.weightedIndex > roll;
    }

    executeSubstitutions(value: string, substitutions: string[]): string {
        for(let substitution of substitutions) {
            value = value.replace(SubstituteRe, substitution);
        }
        return value;
    }
}