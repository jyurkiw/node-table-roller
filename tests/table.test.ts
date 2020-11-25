import { Table, DeepCopyTable } from '../src/interfaces/Table'

import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

@suite
class TestTable {
    @test('Test DeepCopyTable')
    testDeepCopyTable() {
        let t: Table = { name: 'test table', 'version': 1.0, substitutions: true, reference: { table: 'ref table', min: 1, max: 2 } };
        let cp: Table = DeepCopyTable(t);

        cp.name = 'cp table';
        cp.reference.table = 'cp ref table';
        cp.substitutions = false;
        cp.reference.min = 5;
        cp.reference.max = 10;

        expect(t.name).to.be.equal('test table');
        expect(t.substitutions).to.be.true;
        expect(t.reference.min).to.be.equal(1);
        expect(t.reference.max).to.be.equal(2);
    }
}