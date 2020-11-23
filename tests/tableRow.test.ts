import { TableRow, DeepCopyTableRow } from '../src/interfaces/TableRow'

import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

@suite
class TestTableRow {
    @test('test DeepCopyTableRow')
    testDeepCopyTableRow() {
        let tr: TableRow = { value: 'row value', weight: 10, weightedIndex: 0.5, substitutions: ['one', 'two'] };
        let cp: TableRow = DeepCopyTableRow(tr);

        cp.value = 'copy value';
        cp.weight = 100;
        cp.weightedIndex = 1;
        cp.substitutions = ['three', 'four'];

        expect(tr.value).to.be.equal('row value');
        expect(tr.weight).to.be.equal(10);
        expect(tr.weightedIndex).to.be.equal(0.5);
        expect(tr.substitutions).to.be.deep.equal(['one', 'two']);
    }
}