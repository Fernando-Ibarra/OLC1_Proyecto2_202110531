import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Return from './Return';
import Continue from './Continue';

export default class If extends Instruction {
    private condition: Instruction;
    private instructions: Instruction[];
    private instructionsElse: Instruction[] | undefined;
    private elseIf: boolean;

    constructor(condition: Instruction, instructions: Instruction[], row: number, column: number, elseIf: boolean = false, instructionsElse?: Instruction[] ) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.instructionsElse = instructionsElse;
        this.elseIf = elseIf;
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
                if (i instanceof Continue) return i;
                if (i instanceof Return) return i;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break) return result;
                if (result instanceof Return) return result;
                if (result instanceof Continue) return result;
                if (result instanceof Error) return result;

            }
        } else {
            if (this.elseIf) {
                let newTableElse = new SymbolTable(table);
                newTableElse.setName("else Statement");
                if (this.instructionsElse) {
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
                }
            }
        }
    }
}