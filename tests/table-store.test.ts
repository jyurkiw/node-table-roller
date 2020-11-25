import { Table, DeepCopyTable } from '../src/interfaces/Table';
import { TableStore } from '../src/table-store';

import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

let sideTable: Table = {
    'name': 'side',
    'version': 1.0,
    'data': [
        {'value': 'left', weight: 1},
        {'value': 'right', weight: 1}
    ]
};
let exTable: Table = {
    'name': 'ex',
    'version': 1.0,
    'data': [
        {'value': '', weight: 3},
        {'value': 'ex-', weight: 1}
    ]
};
let weightingTable: Table = {
    'name': 'weighting test table',
    'version': 1.0,
    'data': [
        {'value': 'a', weight: 1},
        {'value': 'b', weight: 1},
        {'value': 'c', weight: 1},
        {'value': 'd', weight: 1}
    ]
};
let redirTableA: Table = {
    'name': 'redirectionA',
    'version': 1.0,
    'reference': {
        'table': 'redirection_target',
        'min': 1,
        'max': 2
    }
};
let redirTableB: Table = {
    'name': 'redirectionB',
    'version': 1.0,
    'reference': {
        'table': 'redirection_target',
        'min': 1,
        'max': 1
    }
};
let redirTableC: Table = {
    'name': 'redirectionC',
    'version': 1.0,
    'reference': {
        'table': 'redirection_target',
        'min': 0,
        'max': 3
    }
};
let redirTableZ: Table = {
    'name': 'double redirection',
    'version': 1.0,
    'reference': {
        'table': 'redirectionC',
        'min': 1,
        'max': 2
    }
}
let redirTargetTable: Table = {
    'name': 'redirection_target',
    'version': 1.0,
    'data': [
        { 'value': 'a', 'weight': 1, 'weightedIndex': 0.25 },
        { 'value': 'b', 'weight': 1, 'weightedIndex': 0.5 },
        { 'value': 'c', 'weight': 1, 'weightedIndex': 0.75 },
        { 'value': 'd', 'weight': 1, 'weightedIndex': 1 }
    ]
};
let redirExpected_1_1: Table = {
    'name': 'redirectionB',
    'version': 1.0,
    'data': [
        { 'value': 'b', 'weight': 1, 'weightedIndex': 1 }
    ]
};
let redirExpected_1_2: Table = {
    'name': 'redirectionA',
    'version': 1.0,
    'data': [
        { 'value': 'b', 'weight': 1, 'weightedIndex': 0.5 },
        { 'value': 'c', 'weight': 1, 'weightedIndex': 1 }
    ]
};
let redirExpected_0_3: Table = {
    'name': 'redirectionC',
    'version': 1.0,
    'data': [
        { 'value': 'a', 'weight': 1, 'weightedIndex': 0.25 },
        { 'value': 'b', 'weight': 1, 'weightedIndex': 0.5 },
        { 'value': 'c', 'weight': 1, 'weightedIndex': 0.75 },
        { 'value': 'd', 'weight': 1, 'weightedIndex': 1 }
    ]
};
let redirExpected_double: Table = {
    'name': 'double redirection',
    'version': 1.0,
    'data': [
        { 'value': 'b', 'weight': 1, 'weightedIndex': 0.5 },
        { 'value': 'c', 'weight': 1, 'weightedIndex': 1 }
    ]
};
let noDatTable: Table = { name: 'no data table', 'version': 1.0, };
let td: Table[] = [sideTable, exTable];
let subT

@suite
class TestTableStore {
    private ts: TableStore;

    before() {
        this.ts = new TableStore();
    }

    @test('Test calculate weighted index values: 4 rows')
    testCalculateWeightedIndexValues_4rows() {
        let testTable: Table = DeepCopyTable(weightingTable);
        this.ts.calculateWeightedIndexValues(testTable);
        expect(testTable.data[0].weightedIndex).to.equal(0.25);
        expect(testTable.data[1].weightedIndex).to.equal(0.5);
        expect(testTable.data[2].weightedIndex).to.equal(0.75);
        expect(testTable.data[3].weightedIndex).to.equal(1);
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

    @test('Test get no redirection')
    testGet_noRedirection() {
        this.ts.add(sideTable);
        expect(this.ts.get(sideTable.name)).to.be.deep.equal(sideTable);
    }

    @test('Test get with redirection 1 2')
    testGet_redirection_1_2() {
        this.ts.addm([redirTargetTable, redirTableA]);
        expect(this.ts.get(redirTableA.name))
            .to.be.deep.equal(redirExpected_1_2);
    }

    @test('Test get with redirection 1 1')
    testGet_redirection_1_1() {
        this.ts.addm([redirTargetTable, redirTableB]);
        expect(this.ts.get(redirTableB.name))
            .to.be.deep.equal(redirExpected_1_1);
    }

    @test('Test get with redirection 0 3')
    testGet_redirection_0_3() {
        this.ts.addm([redirTargetTable, redirTableC]);
        expect(this.ts.get(redirTableC.name))
            .to.be.deep.equal(redirExpected_0_3);
    }

    @test('Test get with multiple redirections')
    testGet_multiRedirection() {
        this.ts.addm([redirTargetTable, redirTableC, redirTableZ]);
        expect(this.ts.get(redirTableC.name))
            .to.be.deep.equal(redirExpected_0_3);
        expect(this.ts.get(redirTableZ.name))
            .to.be.deep.equal(redirExpected_double);
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
            'name': 'testtbl',
            'version': 1.0
        };
        expect(() => this.ts.calculateRowSubstitutions(t))
            .to.not.throw();
        expect(t.data).to.be.undefined;
    }

    @test('Test calculateRowSubstitutions substitution flag guard')
    testCalculateRowSubstitutions_substitutionFlagGuard() {
        let t: Table = {
            'name': 'testtbl',
            'version': 1.0,
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
            'version': 1.0,
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