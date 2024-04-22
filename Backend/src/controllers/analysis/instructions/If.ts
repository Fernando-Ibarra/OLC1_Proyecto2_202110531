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
    private nameNode: string;

    constructor(condition: Instruction, instructions: Instruction[], row: number, column: number, instructionsElse?: Instruction[] ) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.instructionsElse = instructionsElse;
        this.nameNode = `${row}_${column}`;
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
                }
            }
        }
    }

    ast(fatherNode: string): string {
        // HEAD
        let newFather = `node_If${ this.nameNode }`;
        let ast = `${ newFather }[label="IF INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`;

        // IF - CONDITION
        ast += `node_If${this.nameNode}_IF [label="if"]\n`;
        ast += `node_If${this.nameNode}_LP[label="("]\n`;
        ast += `node_If${this.nameNode}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_If${this.nameNode}_RP[label=")"]\n`;
        ast += `node_If${this.nameNode}_LB[label="{"]\n`;
        ast += `node_If${this.nameNode}_INSTRUCTIONS_IF [label="INSTRUCTIONS"]\n`;
        ast += `node_If${this.nameNode}_RB[label="}"]\n`;
        

        ast += `${newFather} -> node_If${this.nameNode}_IF\n`;
        ast += `${newFather} -> node_If${this.nameNode}_LP\n`;
        ast += `${newFather} -> node_If${this.nameNode}_EXPRESION\n`;
        ast += `${newFather} -> node_If${this.nameNode}_RP\n`;
        ast += `${newFather} -> node_If${this.nameNode}_LB\n`;
        ast += `${newFather} -> node_If${this.nameNode}_INSTRUCTIONS_IF\n`;
        ast += `${newFather} -> node_If${this.nameNode}_RB\n`;

        ast += this.condition.ast(`node_If${this.nameNode}_EXPRESION`)
        for (let i of this.instructions) {
            ast += i.ast(`node_If${this.nameNode}_INSTRUCTIONS_IF`);
        }
        
        // ELSE IF && ELSE
        if (this.instructionsElse) {
            ast += `node_If${this.nameNode}_ELSE [label="ELSE"]\n`;
            if ( !Array.isArray(this.instructionsElse) ) {
                // ELSE IF
                ast += `${newFather} -> node_If${this.nameNode}_ELSE\n`;
                ast += this.instructionsElse.ast(newFather);
            } else {
                // ELSE
                ast += `${newFather} -> node_If${this.nameNode}_ELSE\n`;
                ast += `node_If${this.nameNode}_LB_ELSE [label="{"]\n`;
                ast += `node_If${this.nameNode}_INSTRUCTIONS_ELSE [label="INSTRUCTIONS"]\n`;
                ast += `node_If${this.nameNode}_RB_ELSE [label="}"]\n`;

                ast += `${newFather} -> node_If${this.nameNode}_LB_ELSE\n`;
                ast += `${newFather} -> node_If${this.nameNode}_INSTRUCTIONS_ELSE\n`;
                ast += `${newFather} -> node_If${this.nameNode}_RB_ELSE\n`;

                for (let i of this.instructionsElse) {
                    ast += i.ast(`node_If${this.nameNode}_INSTRUCTIONS_ELSE`);
                }
            }
        }

        return ast;
    }
}