export interface TableRow {
    value: string;
    weight: number;
    weightedIndex?: number;
    substitutions?: string[];
}

/**
 * Create a deep copy of a table row.
 * @param row The row to deep copy.
 */
export function DeepCopyTableRow(row: TableRow): TableRow {
    let r: TableRow = { value: row.value, weight: row.weight };
    if (row.weightedIndex) { r.weightedIndex = row.weightedIndex; }
    if (row.substitutions) { r.substitutions = row.substitutions.slice(); }

    return r;
}