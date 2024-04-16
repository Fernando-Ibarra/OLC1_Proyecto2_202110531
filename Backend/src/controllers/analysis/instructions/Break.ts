import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Break extends Instruction {
    constructor(row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column)
    }

    interpret(tree: Tree, table: SymbolTable) {
        return;
    }

    ast(fatherNode: string): string {
        let ast = `node_Break${ this.row }_${ this.column }[label="Break"]\n`
        ast += `${ fatherNode } -> node_Break${ this.row }_${ this.column }\n`
        return ""
    }
}