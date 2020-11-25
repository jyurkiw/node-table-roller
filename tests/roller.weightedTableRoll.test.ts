import { Roller } from '../src/roller';
import { Table } from '../src/interfaces/Table';
import { TableRow } from '../src/interfaces/TableRow';

import { suite, test, params } from "@testdeck/mocha";
import { expect } from 'chai';

import * as Linq from 'linq';

@suite
class TestRollerWeightedTableRoll {
    roller: Roller;
    testTable: Table;

    values: string[] = ['one', 'two', 'three', 'four'];
    weights: number[] = [1, 2, 3, 4];

    rolls: number[] = [0, 0.24, 0.25, 0.5, 0.75, 0.76, 0.99, 1];

    before() {
        this.roller = new Roller();
        let t: Table = {
            name: 'test table',
            version: 1.0,
            data: Linq
                .range(0, 4)
                .select(
                    (i) => {
                        return {
                            value: this.values[i],
                            weight: this.weights[i]
                        };
                    })
                .toArray()
        };
        this.roller.addTable(t);
        this.testTable = t;
    }

    performWeightedRollTest(roll: number, expected: number) {
        expect(this.roller.weightedTableRoll('test table', roll))
            .to.be.deep.equal(this.testTable.data[expected]);
    }

    @test('Test roll = 0')
    testWeightedRoll_roll_0() {
        this.performWeightedRollTest(0, 0);
    }

    @test('Test roll = 0.09')
    testWeightedRoll_roll_09() {
        this.performWeightedRollTest(0.09, 0);
    }

    @test('Test roll = 0.1')
    testWeightedRoll_roll_01() {
        this.performWeightedRollTest(0.1, 0);
    }

    @test('Test roll = 0.11')
    testWeightedRoll_roll_011() {
        this.performWeightedRollTest(0.11, 1);
    }

    @test('Test roll = 0.29')
    testWeightedRoll_roll_29() {
        this.performWeightedRollTest(0.29, 1);
    }

    @test('Test roll = 0.3')
    testWeightedRoll_roll_3() {
        this.performWeightedRollTest(0.3, 1);
    }

    @test('Test roll = 0.31')
    testWeightedRoll_roll_31() {
        this.performWeightedRollTest(0.31, 2);
    }

    @test('Test roll = 0.59')
    testWeightedRoll_roll_59() {
        this.performWeightedRollTest(0.59, 2);
    }

    @test('Test roll = 0.6')
    testWeightedRoll_roll_6() {
        this.performWeightedRollTest(0.6, 2);
    }

    @test('Test roll = 0.61')
    testWeightedRoll_roll_61() {
        this.performWeightedRollTest(0.61, 3);
    }

    @test('Test roll = 0.99')
    testWeightedRoll_roll_99() {
        this.performWeightedRollTest(0.99, 3);
    }

    @test('Test roll = 1')
    testWeightedRoll_roll_1() {
        this.performWeightedRollTest(1, 3);
    }
}