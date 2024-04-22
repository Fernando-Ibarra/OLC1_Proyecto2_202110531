import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Continue from './Continue';
import Return from './Return';

export default class DoWhile extends Instruction {
    private condition: Instruction;
    private instructions: Instruction[];
    private nodeName: string;

    constructor(condition: Instruction, instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        do {
            let newTable = new SymbolTable(table);
            for (let i of this.instructions) {
                if (i instanceof Break ) return;
                if (i instanceof Continue) continue;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break) {
                    return;
                }
                if (result instanceof Continue) {
                    continue;
                }
                if (result instanceof Return) {
                    return result;
                }
                if (result instanceof Error) {
                    return;
                }
            }
        } while(this.condition.interpret(tree, table));
    }

    ast(fatherNode: string): string {
        let newFather = `node_DoWhile${this.nodeName}`;
        let ast = `${newFather}[label="DO WHILE INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;


        ast += `node_DoWhile${this.nodeName}_DO [label="do"]\n`;
        ast += `node_DoWhile${this.nodeName}_LB[label="{"]\n`;
        ast += `node_DoWhile${this.nodeName}_INSTRUCTIONS_DW [label="INSTRUCTIONS"]\n`;
        ast += `node_DoWhile${this.nodeName}_RB[label="}"]\n`;
        ast += `node_DoWhile${this.nodeName}_WH [label="while"]\n`;
        ast += `node_DoWhile${this.nodeName}_LP[label="("]\n`;
        ast += `node_DoWhile${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_DoWhile${this.nodeName}_RP[label=")"]\n`;

        ast += `${newFather} -> node_DoWhile${this.nodeName}_DO\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_INSTRUCTIONS_DW\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_RB\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_WH\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_RP\n`;

        ast += this.condition.ast(`node_DoWhile${this.nodeName}_EXPRESION`);
        for (let i of this.instructions) {
            ast += i.ast(`node_DoWhile${this.nodeName}_INSTRUCTIONS_DW`);
        }

        return ast;
    }

}