import { Roller } from '../src/roller';

import { RollPlan } from '../src/interfaces/RollPlan';
import { Table } from '../src/interfaces/Table';
import { TableReference } from '../src/interfaces/TableReference';
import { TableRoll } from '../src/interfaces/TableRoll';
import { TableRow } from '../src/interfaces/TableRow';

import { suite, test, params } from "@testdeck/mocha";
import { expect } from 'chai';

import * as Linq from 'linq';

// Mock Math.random
let psuedoRandomNums: number[] = [];
let rand = Math.random;

@suite
class TestRoller_RollFunction {
    roller: Roller;

    before() {
        this.roller = new Roller();
        Math.random = () => psuedoRandomNums.shift();
    }

    after() {
        Math.random = rand;
    }

    createTableRow(value: string, weight: number = 1): TableRow {
        return {
            value: value,
            weight: weight
        };
    }

    createTableRows(values: string[], weights?: number[]): TableRow[] {
        let w: boolean = weights && weights.length >= values.length;
        return Linq
            .range(0, values.length)
            .select(i => this.createTableRow(
                values[i],
                w ? weights[i] : 1)
            )
            .toArray();
    }

    createTable(name: string, data?: TableRow[], substitutions?: boolean, reference?: TableReference): Table {
        let t: Table = {
            name: name,
            version: 1.0
        };
        if (data) t.data = data;
        if (substitutions) t.substitutions = substitutions;
        if (reference) t.reference = reference;

        this.roller.addTable(t);
        return t;
    }

    createPlan(name: string, rolls: TableRoll[]): void {
        this.roller.addRollPlan({
            name: name,
            version: 1.0,
            rolls: rolls
        });
    }

    createTableRoll(table: Table, num: number = 1, min?: number, max?: number): TableRoll {
        return {
            table: table.name,
            minRolls: min,
            maxRolls: max,
            numRolls: num
        }
    }

    @test('Roll numbers table: one')
    testRollNumbersTable_one() {
        let t: Table = this.createTable(
            'number table',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        this.createPlan('number plan', [
            this.createTableRoll(t)
        ]);

        let a: string = Linq.from(this.roller.roll('number plan', [0.15])).first();
        expect(a).to.be.equal('one');
    }

    @test('Roll numbers table: two')
    testRollNumbersTable_two() {
        let t: Table = this.createTable(
            'number table',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        this.createPlan('number plan', [
            this.createTableRoll(t)
        ]);

        let a: string = Linq.from(this.roller.roll('number plan', [0.35])).first();
        expect(a).to.be.equal('two');
    }

    @test('Roll numbers table: three')
    testRollNumbersTable_three() {
        let t: Table = this.createTable(
            'number table',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        this.createPlan('number plan', [
            this.createTableRoll(t)
        ]);

        let a: string = Linq.from(this.roller.roll('number plan', [0.65])).first();
        expect(a).to.be.equal('three');
    }

    @test('Roll numbers table: four')
    testRollNumbersTable_four() {
        let t: Table = this.createTable(
            'number table',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        this.createPlan('number plan', [
            this.createTableRoll(t)
        ]);

        let a: string = Linq.from(this.roller.roll('number plan', [0.85])).first();
        expect(a).to.be.equal('four');
    }

    @test('Roll substitution table: two')
    testRollSubstitutionTable_one() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numbers substitution table',
            this.createTableRows([
                '{numbers}',
                '{numbers}{numbers}',
                '{numbers}{numbers}{numbers}',
                '{numbers}{numbers}{numbers}{numbers}']),
                true
        );
        this.createPlan('numSub plan', [this.createTableRoll(numSub)]);

        psuedoRandomNums = [0.35];
        let a: string = Linq.from(this.roller.roll('numSub plan', [0.15])).first();
        expect(a).to.be.equal('two');
    }

    @test('Roll substitution table: onetwo')
    testRollSubstitutionTable_onetwo() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numbers substitution table',
            this.createTableRows([
                '{numbers}',
                '{numbers}{numbers}',
                '{numbers}{numbers}{numbers}',
                '{numbers}{numbers}{numbers}{numbers}']),
                true
        );
        this.createPlan('numSub plan', [this.createTableRoll(numSub)]);

        psuedoRandomNums = [0.15, 0.35];
        let a: string = Linq.from(this.roller.roll('numSub plan', [0.35])).first();
        expect(a).to.be.equal('onetwo');
    }

    @test('Roll substitution table: onetwothree')
    testRollSubstitutionTable_onetwothree() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numbers substitution table',
            this.createTableRows([
                '{numbers}',
                '{numbers}{numbers}',
                '{numbers}{numbers}{numbers}',
                '{numbers}{numbers}{numbers}{numbers}']),
                true
        );
        this.createPlan('numSub plan', [this.createTableRoll(numSub)]);

        psuedoRandomNums = [0.15, 0.35, 0.65];
        let a: string = Linq.from(this.roller.roll('numSub plan', [0.65])).first();
        expect(a).to.be.equal('onetwothree');
    }

    @test('Roll substitution table: onetwothreefour')
    testRollSubstitutionTable_onetwothreefour() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numbers substitution table',
            this.createTableRows([
                '{numbers}',
                '{numbers}{numbers}',
                '{numbers}{numbers}{numbers}',
                '{numbers}{numbers}{numbers}{numbers}']),
                true
        );
        this.createPlan('numSub plan', [this.createTableRoll(numSub)]);

        psuedoRandomNums = [0.15, 0.35, 0.65, 0.85];
        let a: string = Linq.from(this.roller.roll('numSub plan', [0.85])).first();
        expect(a).to.be.equal('onetwothreefour');
    }

    @test('Roll substitution table: of one')
    testRollSubstitutionTable_nestedSubstitution_ofone() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numSub',
            this.createTableRows([
                'of {numbers}',
                'hi {numbers}',
                'ho {numbers}',
                'nu {numbers}']),
                true
        );
        let numSubSub: Table = this.createTable(
            'numbers substitution substitution table',
            this.createTableRows([
                '{numSub}',
                '{numSub}{numSub}',
                '{numSub}{numSub}{numSub}',
                '{numSub}{numSub}{numSub}{numSub}']),
                true
        );
        this.createPlan('numSubSub plan', [this.createTableRoll(numSubSub)]);

        psuedoRandomNums = [0.15, 0.15];
        let a: string = Linq.from(this.roller.roll('numSubSub plan', [0.15])).first();
        expect(a).to.be.equal('of one');
    }

    @test('Roll substitution table: of one hi two')
    testRollSubstitutionTable_nestedSubstitution_hitwo() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numSub',
            this.createTableRows([
                'of {numbers}',
                'hi {numbers}',
                'ho {numbers}',
                'nu {numbers}']),
                true
        );
        let numSubSub: Table = this.createTable(
            'numbers substitution substitution table',
            this.createTableRows([
                '{numSub}',
                '{numSub} {numSub}',
                '{numSub} {numSub} {numSub}',
                '{numSub} {numSub} {numSub} {numSub}']),
                true
        );
        this.createPlan('numSubSub plan', [this.createTableRoll(numSubSub)]);

        psuedoRandomNums = [0.35, 0.15, 0.15, 0.35, 0.35];
        let a: string = Linq.from(this.roller.roll('numSubSub plan')).first();
        expect(a).to.be.equal('of one hi two');
    }

    @test('Roll substitution table: of one hi two ho three')
    testRollSubstitutionTable_nestedSubstitution_hothree() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numSub',
            this.createTableRows([
                'of {numbers}',
                'hi {numbers}',
                'ho {numbers}',
                'nu {numbers}']),
                true
        );
        let numSubSub: Table = this.createTable(
            'numbers substitution substitution table',
            this.createTableRows([
                '{numSub}',
                '{numSub} {numSub}',
                '{numSub} {numSub} {numSub}',
                '{numSub} {numSub} {numSub} {numSub}']),
                true
        );
        this.createPlan('numSubSub plan', [this.createTableRoll(numSubSub)]);

        psuedoRandomNums = [0.65, 0.15, 0.15, 0.35, 0.35, 0.65, 0.65];
        let a: string = Linq.from(this.roller.roll('numSubSub plan')).first();
        expect(a).to.be.equal('of one hi two ho three');
    }

    @test('Roll substitution table: of one hi two ho three nu four')
    testRollSubstitutionTable_nestedSubstitution_nufour() {
        let numbers: Table = this.createTable(
            'numbers',
            this.createTableRows(['one', 'two', 'three', 'four'])
        );
        let numSub: Table = this.createTable(
            'numSub',
            this.createTableRows([
                'of {numbers}',
                'hi {numbers}',
                'ho {numbers}',
                'nu {numbers}']),
                true
        );
        let numSubSub: Table = this.createTable(
            'numbers substitution substitution table',
            this.createTableRows([
                '{numSub}',
                '{numSub} {numSub}',
                '{numSub} {numSub} {numSub}',
                '{numSub} {numSub} {numSub} {numSub}']),
                true
        );
        this.createPlan('numSubSub plan', [this.createTableRoll(numSubSub)]);

        psuedoRandomNums = [0.85, 0.15, 0.15, 0.35, 0.35, 0.65, 0.65, 0.85, 0.85];
        let a: string = Linq.from(this.roller.roll('numSubSub plan')).first();
        expect(a).to.be.equal('of one hi two ho three nu four');
    }
}