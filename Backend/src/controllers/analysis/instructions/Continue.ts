import { Instruction, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Continue extends Instruction {
    constructor(row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column)
    }

    interpret(tree: Tree, table: SymbolTable) {
        return;
    }
}