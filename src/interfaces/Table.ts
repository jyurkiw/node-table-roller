import {TableRow} from './TableRow';
import {TableReference} from './TableReference';
import {NameMappable} from './NameMappable';


export interface Table extends NameMappable {
    data?: TableRow[];
    substitutions?: boolean;
    reference?: TableReference;
}