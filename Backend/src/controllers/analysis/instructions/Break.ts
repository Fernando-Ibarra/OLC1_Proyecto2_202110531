import {Instruction, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Break extends Instruction {
    private nodeName: string;

    constructor(row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column)
        this.nodeName = `${row}_${column}`
    }

    interpret(tree: Tree, table: SymbolTable) {
        return;
    }

    ast(fatherNode: string): string {
        let newFather = `node_Break${ this.nodeName }`
        let ast = `${newFather}[label="Break"]\n`
        ast += `${ fatherNode } -> node_Break${ this.nodeName }\n`
        ast += `node_Break${this.nodeName}_SC [label=";"]\n`;
        ast += `${fatherNode} -> node_Break${this.nodeName}_SC\n`
        return ast
    }
}