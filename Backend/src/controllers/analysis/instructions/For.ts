import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Continue from './Continue';
import Return from './Return';

export default class For extends Instruction {
    private declaration: Instruction;
    private condition: Instruction;
    private increment: Instruction;
    private instructions: Instruction[];
    private nodeName: string;

    constructor(declaration: Instruction, condition: Instruction, increment: Instruction, instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.declaration = declaration;
        this.condition = condition;
        this.increment = increment;
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let newTable = new SymbolTable(table);
        let dec = this.declaration.interpret(tree, newTable);
        if (dec instanceof Error) return dec;

        let cond = this.condition.interpret(tree, newTable);
        if (cond instanceof Error) return cond;

        if (this.condition.typeData.getTypeData() != typeData.BOOL) {
            return new Error("Semántico", "Se esperaba una expresión booleana en la condición del for", this.row, this.column);
        }

        let conditionValue = this.condition.interpret(tree, newTable);

        while(conditionValue == true) {
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
            let inc = this.increment.interpret(tree, newTable);
            if (inc instanceof Error) return inc;

            conditionValue = this.condition.interpret(tree, newTable);
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_For${this.nodeName}`;
        let ast = `${newFather}[label="FOR INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        // FOR - DECLARATION
        ast += `node_For${this.nodeName}_FOR [label="for"]\n`;
        ast += `node_For${this.nodeName}_LP[label="("]\n`;
        ast += `node_For${this.nodeName}ASSIGN [label="DECLARATION/ASSIGN"]\n`;
        ast += `node_For${this.nodeName}_SC1 [label=";"]\n`;
        ast += `node_For${this.nodeName}_CONDITION [label="CONDITION"]\n`;
        ast += `node_For${this.nodeName}_SC2 [label=";"]\n`;
        ast += `node_For${this.nodeName}_UPDATE [label="UPDATE"]\n`;
        ast += `node_For${this.nodeName}_RP[label=")"]\n`;
        ast += `node_For${this.nodeName}_LB[label="{"]\n`;
        ast += `node_For${this.nodeName}_INSTRUCTIONS_FOR [label="INSTRUCTIONS"]\n`;
        ast += `node_For${this.nodeName}_RB[label="}"]\n`;


        ast += `${newFather} -> node_For${this.nodeName}_FOR\n`;
        ast += `${newFather} -> node_For${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_For${this.nodeName}ASSIGN\n`;
        ast += `${newFather} -> node_For${this.nodeName}_SC1\n`;
        ast += `${newFather} -> node_For${this.nodeName}_CONDITION\n`;
        ast += `${newFather} -> node_For${this.nodeName}_SC2\n`;
        ast += `${newFather} -> node_For${this.nodeName}_UPDATE\n`;
        ast += `${newFather} -> node_For${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_For${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_For${this.nodeName}_INSTRUCTIONS_FOR\n`;
        ast += `${newFather} -> node_For${this.nodeName}_RB\n`;

        ast += this.declaration.ast(`node_For${this.nodeName}ASSIGN`)
        ast += this.condition.ast(`node_For${this.nodeName}_CONDITION`)
        ast += this.increment.ast(`node_For${this.nodeName}_UPDATE`)


        for (let i of this.instructions) {
            ast += i.ast(`node_For${this.nodeName}_INSTRUCTIONS_FOR`);
        }
        return ast;
    }
}