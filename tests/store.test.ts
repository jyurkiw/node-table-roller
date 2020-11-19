import { Store } from '../src/store';
import { NameMappable } from '../src/interfaces/NameMappable';

import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

export class NamedNum implements NameMappable {
    name: string;
    constructor(n: string) { this.name = n; }
}

let firstNum: NamedNum = new NamedNum('first');
let secNum: NamedNum = new NamedNum('second');

@suite
class TestStore {
    private store: Store<NamedNum> = new Store<NamedNum>();

    @test('Test the add method')
    testAdd() {
        this.store.add(firstNum);
        expect(this.store.has(firstNum.name)).to.be.true;
    }

    @test('Test the addm method')
    testAddData() {
        this.store.addm([firstNum, secNum]);
        expect(this.store.size()).to.be.eq(2);
    }

    @test('Test duplicate table error')
    testAdd_DuplicateFail() {
        expect(() => this.store.addm([firstNum, firstNum]))
            .to.throw('Duplicate item: ' + firstNum.name);
    }

    @test('Test remove table')
    testRemoveSuccess() {
        this.store.add(firstNum);
        expect(this.store.remove(firstNum.name)).to.be.true;
        expect(this.store.has(firstNum.name)).to.be.false;
    }

    @test('Test remove non-existant table')
    testRemoveFail() {
        expect(this.store.remove(firstNum.name)).to.be.false;
    }

    @test('Test get existing table')
    testGetSuccess() {
        this.store.add(firstNum);
        expect(this.store.get(firstNum.name).name)
            .to.be.eq(firstNum.name);
    }

    @test('Test get non-existing table')
    testGetFail() {
        expect(() => this.store.get(firstNum.name))
            .to.throw(firstNum.name + ' does not exist.');
    }
}