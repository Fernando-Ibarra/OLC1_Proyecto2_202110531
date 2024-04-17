import { Instruction, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';

import Break from './Break';

export default class Case extends Instruction {
    public expression: Instruction;
    private instructions: Instruction[];
    private nodeName: string;

    constructor(expression: Instruction, instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.expression = expression;
        this.instructions = instructions;
        this.nodeName = `Case${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let newTable = new SymbolTable(table);
        newTable.setName("Case Statement");
        let value = this.expression.interpret(tree, table);
        if (value instanceof Error) return value;
        for (let i of this.instructions) {
            if (i instanceof Error) return i;
            if (i instanceof Break) return i;
            let result = i.interpret(tree, newTable);
            if (result instanceof Error) return result;
            if (result instanceof Break) return result;
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_Case${this.nodeName}`;
        let ast = `${newFather}[label="Case"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Case${this.nodeName}_1[label="Expression"]\n`;
        ast += `${newFather} -> node_Case${this.nodeName}_1\n`;
        ast += this.expression.ast(`node_Case${this.nodeName}_1`);
        for (let i of this.instructions) {
            ast += i.ast(newFather);
        }
        return ast;
    }

}