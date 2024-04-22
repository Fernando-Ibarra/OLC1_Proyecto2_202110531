import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Default extends Instruction {
    private instructions: Instruction[];
    private nodeName: string;

    constructor(instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let newTable = new SymbolTable(table);
        newTable.setName("Default Statement");
        for (let i of this.instructions) {
            if (i instanceof Error) return i;
            let result = i.interpret(tree, newTable);
            if (result instanceof Error) return result;
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_Default${this.nodeName}`;
        let ast = `${newFather}[label="DEFAULT INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Default${this.nodeName}_DF [label="default"]\n`;
        ast += `node_Default${this.nodeName}_SC[label=":"]\n`;
        ast += `node_Default${this.nodeName}_INSTRUCTIONS [label="INSTRUCTIONS"]\n`;

        ast += `${newFather} -> node_Default${this.nodeName}_DF\n`;
        ast += `${newFather} -> node_Default${this.nodeName}_SC\n`;
        ast += `${newFather} -> node_Default${this.nodeName}_INSTRUCTIONS\n`;

        for (let i of this.instructions) {
            ast += i.ast(`node_Default${this.nodeName}_INSTRUCTIONS`);
        }
        return ast;
    }
}