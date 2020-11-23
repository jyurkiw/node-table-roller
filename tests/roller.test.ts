import { Table } from '../src/interfaces/Table';
import { TableRoll } from '../src/interfaces/TableRoll';
import { TableRow } from '../src/interfaces/TableRow';
import { Roller } from '../src/roller';
import { RollPlan } from '../src/interfaces/RollPlan';


import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

let aRow: TableRow = { value: 'a', weight: 1, weightedIndex: 0.25 };
let bRow: TableRow = { value: 'a', weight: 1, weightedIndex: 0.75 };

let tA: Table = {
    'name': 'a',
    'data': [
        {'value': 'a', weight: 1},
        {'value': 'b', weight: 1},
        {'value': 'c', weight: 1},
        {'value': 'd', weight: 1}
    ]
};
let tB: Table = {
    'name': 'b',
    'data': [
        {'value': 'a', weight: 1},
        {'value': 'b', weight: 1},
        {'value': 'c', weight: 1},
        {'value': 'd', weight: 1}
    ]
};
let rpA: RollPlan = {'name': 'roll plan a', 'rolls': []};
let rpB: RollPlan = {'name': 'roll plan b', 'rolls': []};

@suite
class TestRoller {
    private roller: Roller;
    randomNumbers: number[] = [];
    rand = Math.random;

    before() {
        this.roller = new Roller();
        Math.random = () => this.randomNumbers.shift();
    }

    after() {
        Math.random = this.rand;
    }

    @test('Test size default')
    testSize_Default() {
        let a = this.roller.size();
        let e = { tables: 0, plans: 0 };
        expect(a).to.deep.equal(e);
    }

    @test('Test size: 1 1')
    testSize_1_1() {
        this.roller.addTable(tA);
        this.roller.addRollPlan(rpA);
        let a = this.roller.size();
        let e = { tables: 1, plans: 1 };
        expect(a).to.deep.equal(e);
    }

    @test('Test add tables')
    testAddTables_Success() {
        this.roller.addTables([tA, tB]);
        let a = this.roller.size();
        let e = 2
        expect(a.tables).to.deep.equal(e);
    }

    @test('Test add roll plans')
    testAddRollPlans_Success() {
        this.roller.addRollPlans([rpA, rpB]);
        let a = this.roller.size();
        let e = 2
        expect(a.plans).to.deep.equal(e);
    }

    @test('Test between: roll < a')
    testBetween_rollLessThanA() {
        let v = 0.24;
        let e = -1;
        let a = this.roller.between(aRow, v, bRow);
        expect(a).to.be.equal(e);
    }

    @test('Test between: roll = a')
    testBetween_rollEqualToA() {
        let v = 0.25;
        let e = -1;
        let a = this.roller.between(aRow, v, bRow);
        expect(a).to.be.equal(e);
    }

    @test('Test between: roll > a')
    testBetween_rollGreaterThanA() {
        let v = 0.26;
        let e = 0;
        let a = this.roller.between(aRow, v, bRow);
        expect(a).to.be.equal(e);
    }

    @test('Test between: roll < b')
    testBetween_rollLessThanB() {
        let v = 0.74;
        let e = 0;
        let a = this.roller.between(aRow, v, bRow);
        expect(a).to.be.equal(e);
    }

    @test('Test between: roll = b')
    testBetween_rollEqualToB() {
        let v = 0.75;
        let e = 0;
        let a = this.roller.between(aRow, v, bRow);
        expect(a).to.be.equal(e);
    }

    @test('Test between: roll > b')
    testBetween_rollGreaterThanB() {
        let v = 0.76;
        let e = 1;
        let a = this.roller.between(aRow, v, bRow);
        expect(a).to.be.equal(e);
    }

    @test('Test execute substitutions')
    testExecuteSubstitutions() {
        let v = "{item} {bank} {puppy}";
        let s = ['sword', 'gold', 'schnowzer']
        let e = s.join(' ');

        let a = this.roller.executeSubstitutions(v, s);
        expect(a).be.deep.equal(e);
    }

    @test('Test getRollNum: only numRolls')
    testGetRollNum_returnNumRoll() {
        let tRoll: TableRoll = { table: 'test tbl', numRolls: 4 };
        let a: number = this.roller.getRollNum(tRoll);

        expect(a).to.be.equal(4);
    }

    @test('Test getRollNum: min and max')
    testGetRollNum_minAndMax() {
        this.randomNumbers = [0.5];
        let tRoll: TableRoll = { table: 'test tbl', minRolls: 4, maxRolls: 12 };
        let a: number = this.roller.getRollNum(tRoll);

        expect(a).to.be.equal(8);
    }

    @test('Test getRollNum: max')
    testGetRollNum_max() {
        this.randomNumbers = [0.5];
        let tRoll: TableRoll = { table: 'test tbl', maxRolls: 12 };
        let a: number = this.roller.getRollNum(tRoll);

        expect(a).to.be.equal(6);
    }

    @test('Test getRollNum: one')
    testGetRollNum_one() {
        let tRoll: TableRoll = { table: 'test tbl' };
        let a: number = this.roller.getRollNum(tRoll);

        expect(a).to.be.equal(1);
    }
}