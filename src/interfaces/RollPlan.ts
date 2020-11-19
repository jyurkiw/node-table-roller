import {NameMappable} from './NameMappable';
import {TableRoll} from './TableRoll';

export interface RollPlan extends NameMappable {
    rolls: TableRoll[];
}