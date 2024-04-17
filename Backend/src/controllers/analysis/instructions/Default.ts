import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Default extends Instruction {
    private instructions: Instruction[];

    constructor(instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.instructions = instructions;
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
        let ast = `node_Default${ this.row }_${ this.column }[label="Default"]\n`
        ast += `${ fatherNode } -> node_Default${ this.row }_${ this.column }\n`
        for (let i of this.instructions) {
            ast += i.ast(`node_Defaul${ this.row }_${ this.column }`)
        }
        return ast;
    }
}