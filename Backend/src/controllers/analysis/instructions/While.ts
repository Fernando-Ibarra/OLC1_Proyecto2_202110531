import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Continue from './Continue';
import Return from './Return';

export default class While extends Instruction {
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
        let cond = this.condition.interpret(tree, table);
        if (cond instanceof Error) return cond;

        if (this.condition.typeData.getTypeData() != typeData.BOOL) {
            return new Error("Semántico", "Se esperaba una expresión booleana en la condición del while", this.row, this.column);
        }

        while(this.condition.interpret(tree, table)) {
            let newTable = new SymbolTable(table);
            for (let i of this.instructions) {
                if (i instanceof Break ) return;
                if (i instanceof Continue) break;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break) {
                    return;
                }
                if (result instanceof Continue) {
                    break;
                }
                if (result instanceof Error) {
                    return;
                }
                if (result instanceof Return) {
                    return result;
                }
            }
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_While${this.nodeName}`;
        let ast = `${newFather}[label="WHILE INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        // WHILE CONDITION
        ast += `node_While${this.nodeName}_WH [label="while"]\n`;
        ast += `node_While${this.nodeName}_LP[label="("]\n`;
        ast += `node_While${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_While${this.nodeName}_RP[label=")"]\n`;
        ast += `node_While${this.nodeName}_LB[label="{"]\n`;
        ast += `node_While${this.nodeName}_INSTRUCTIONS_WHILE [label="INSTRUCTIONS"]\n`;
        ast += `node_While${this.nodeName}_RB[label="}"]\n`;

        ast += `${newFather} -> node_While${this.nodeName}_WH\n`;
        ast += `${newFather} -> node_While${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_While${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_While${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_While${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_While${this.nodeName}_INSTRUCTIONS_WHILE\n`;
        ast += `${newFather} -> node_While${this.nodeName}_RB\n`;

        ast += this.condition.ast(`node_While${this.nodeName}_EXPRESION`)

        for (let i of this.instructions) {
            ast += i.ast(`node_While${this.nodeName}_INSTRUCTIONS_WHILE`);
        }

        return ast;
    }
}