export interface TableReference {
    table: string;
    min: number;
    max: number;
}

/**
 * Create a deep copy of a TableReference object.
 * @param reference The table reference to deep copy.
 */
export function DeepCopyTableReference(reference: TableReference)
    : TableReference {
    return {
        table: reference.table,
        min: reference.min,
        max: reference.max
    }
}