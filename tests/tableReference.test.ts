import { TableReference, DeepCopyTableReference } from '../src/interfaces/TableReference'

import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

@suite
class TestTableReference {
    @test('Test deep copy table reference')
    testDeepCopyTableReference() {
        let ref: TableReference = { table: 'test table', min: 4, max: 5 };
        let cp: TableReference = DeepCopyTableReference(ref);
        cp.table = 'copy table';
        cp.min = 10;
        cp.max = 100;
        
        expect(ref.table).to.be.equal('test table');
        expect(ref.min).to.be.equal(4);
        expect(ref.max).to.be.equal(5);
    }
}