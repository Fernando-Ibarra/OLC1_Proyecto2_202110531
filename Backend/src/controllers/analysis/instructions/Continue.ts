import { Instruction, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Continue extends Instruction {
    constructor(row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column)
    }

    interpret(tree: Tree, table: SymbolTable) {
        return;
    }

    ast(fatherNode: string): string {
        let ast = `node_Continue${ this.row }_${ this.column }[label="Continue"]\n`
        ast += `${ fatherNode } -> node_Continue${ this.row }_${ this.column }\n`
        return ast
    }
}