import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Continue from './Continue';
import Return from './Return';

export default class DoWhile extends Instruction {
    private condition: Instruction;
    private instructions: Instruction[];

    constructor(condition: Instruction, instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
    }

    interpret(tree: Tree, table: SymbolTable) {
        do {
            let newTable = new SymbolTable(table);
            for (let i of this.instructions) {
                if (i instanceof Break ) return;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break) {
                    return;
                }
                if (result instanceof Continue) {
                    break;
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

}