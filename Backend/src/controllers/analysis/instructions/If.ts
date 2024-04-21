import { Instruction, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Return from './Return';
import Continue from './Continue';

export default class If extends Instruction {
    private condition: Instruction;
    private instructions: Instruction[];
    private instructionsElse: Instruction[] | Instruction | undefined;
    private nodeName: string;

    constructor(condition: Instruction, instructions: Instruction[], row: number, column: number, instructionsElse?: Instruction[] ) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.instructionsElse = instructionsElse;
        this.nodeName = `If${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let cond = this.condition.interpret(tree, table);
        if (cond instanceof Error) return cond;

        if (this.condition.typeData.getTypeData() != typeData.BOOL) {
            return new Error("Semántico", "Se esperaba una expresión booleana en la condición del if", this.row, this.column);
        }

        if (cond) {
            let newTable = new SymbolTable(table);
            newTable.setName("If Statement");
            for (let i of this.instructions) {
                if (i instanceof Break) return i;
                if (i instanceof Return) {
                    return i
                };
                if (i instanceof Continue) return i;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break) return result;
                if (result instanceof Return) {
                    return result
                };
                if (result instanceof Continue) return result;
                if (result instanceof Error) return result;

            }
        } else {
            if ( Array.isArray(this.instructionsElse) ) {
                let newTableElse = new SymbolTable(table);
                newTableElse.setName("else Statement");
                for (let i of this.instructionsElse) {
                    if (i instanceof Break) return i;
                    if (i instanceof Continue) return i;
                    if (i instanceof Return) return i;
                    let result = i.interpret(tree, newTableElse);
                    if (result instanceof Break) return result;
                    if (result instanceof Return) return result;
                    if (result instanceof Continue) return result;
                    if (result instanceof Error) return result;
                }
            } else {
                if ( this.instructionsElse instanceof If ) {
                    let newTableElse = new SymbolTable(table);
                    newTableElse.setName("else if Statement");
                    let result = this.instructionsElse.interpret(tree, newTableElse);
                    console.log(`ELSE IF ${result}`);
                }
            }
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_If${this.nodeName}`;
        let ast = `${newFather}[label="If"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_If${this.nodeName}_1[label="Condition"]\n`;
        ast += `${newFather} -> node_If${this.nodeName}_1\n`;
        ast += this.condition.ast(`node_If${this.nodeName}_1`);
        for (let i of this.instructions) {
            ast += i.ast(newFather);
        }
        ast += `node_If${this.nodeName}_2[label="Else"]\n`;
        ast += `${newFather} -> node_If${this.nodeName}_2\n`;
        // if (this.instructionsElse) {
            // for (let i of this.instructionsElse) {
            //     ast += i.ast(`node_If${this.nodeName}_2`);
            // }
        // }
        return ast;
    }
}