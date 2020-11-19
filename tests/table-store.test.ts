import { Table } from '../src/interfaces/Table';
import { TableStore } from '../src/table-store';

import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

let sideTable: Table = {
    'name': 'side',
    'data': [
        {'value': 'left', weight: 1},
        {'value': 'right', weight: 1}
    ]
};
let exTable: Table = {
    'name': 'ex',
    'data': [
        {'value': '', weight: 3},
        {'value': 'ex-', weight: 1}
    ]
};
let noDatTable: Table = { name: 'no data table' };
let td: Table[] = [sideTable, exTable];
let subT

@suite
class TestTableStore {
    private ts: TableStore;

    before() {
        this.ts = new TableStore();
    }

    @test('Test add overload')
    testAdd_Success() {
        this.ts.add(sideTable);
        expect(this.ts.has(sideTable.name)).to.be.true;
    }

    @test('Test add overload failure')
    testAdd_Fail() {
        this.ts.add(sideTable);
        let actual: boolean = this.ts.add(sideTable);
        expect(actual).to.be.false;
    }

    @test('Test processTable: no table data failure')
    testProcessTable_executionGuardSuccess() {
        expect(this.ts.processTable(noDatTable)).to.be.false;
    }

    @test('Test processTable: table processes weighted indicies')
    testProcessTable_success() {
        this.ts.add(sideTable);
        let t: Table = this.ts.get(sideTable.name);
        expect(t.data[0].weightedIndex).to.not.be.undefined;
    }

    @test('Test calculateRowSubstitutions data flag guard')
    testCalculateRowSubstitutions_dataGuardFail() {
        let t: Table = {
            'name': 'testtbl'
        };
        expect(() => this.ts.calculateRowSubstitutions(t))
            .to.not.throw();
        expect(t.data).to.be.undefined;
    }

    @test('Test calculateRowSubstitutions substitution flag guard')
    testCalculateRowSubstitutions_substitutionFlagGuard() {
        let t: Table = {
            'name': 'testtbl',
            'data': [
                { 'value': '{test}', 'weight': 1}
            ]
        };
        this.ts.calculateRowSubstitutions(t);
        expect(t.data[0].substitutions).to.be.undefined;
    }

    @test('Test calculateRowSubstitutions success')
    testCalculateRowSubstitutions_success() {
        let t: Table = {
            'name': 'substitution table',
            'substitutions': true,
            'data': [
                {'value': 'we {ship} this', weight: 1},
                {'value': 'we {boat} {that}', weight: 1}
            ]
        };
        this.ts.calculateRowSubstitutions(t);
        expect(t.data[0].substitutions).to.not.be.undefined;
        expect(t.data[0].substitutions).to.deep.equal(['ship']);
        expect(t.data[1].substitutions).to.not.be.undefined;
        expect(t.data[1].substitutions).to.deep.equal(['boat', 'that']);
    }
}