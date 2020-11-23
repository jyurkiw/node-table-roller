import {TableRow,DeepCopyTableRow} from './TableRow';
import {TableReference,DeepCopyTableReference} from './TableReference';
import {NameMappable} from './NameMappable';

import * as Linq from 'linq';

export interface Table extends NameMappable {
    data?: TableRow[];
    substitutions?: boolean;
    reference?: TableReference;
}

export function DeepCopyTable(table: Table): Table {
    let t: Table = { name: table.name }
    if (table.data) { 
        t.data = Linq
            .from(table.data)
            .select((row) => DeepCopyTableRow(row))
            .toArray();
    }
    if (table.reference) {
        t.reference = DeepCopyTableReference(table.reference);
    };
    if (table.substitutions) { t.substitutions = table.substitutions; }

    return t;
}