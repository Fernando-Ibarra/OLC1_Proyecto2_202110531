import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Ternary extends Instruction {
    private condition: Instruction;
    private conditionTrue: Instruction;
    private conditionFalse: Instruction;

    constructor(condition: Instruction, conditionTrue: Instruction, conditionFalse: Instruction, row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.conditionTrue = conditionTrue;
        this.conditionFalse = conditionFalse;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let cond = this.condition.interpret(tree, table);
        if (cond instanceof Error) return cond;

        if (this.condition.typeData.getTypeData() != typeData.BOOL) {
            return new Error("Semántico", "Se esperaba una expresión booleana en la condición del ternario", this.row, this.column);
        }

        if (cond) {
            this.typeData = this.conditionTrue.typeData;
            let value = this.conditionTrue.interpret(tree, table);
            if (value instanceof Error) return value;
            return value;
        } else {
            this.typeData = this.conditionFalse.typeData;
            let value = this.conditionFalse.interpret(tree, table);
            if (value instanceof Error) return value;
            return value;
        }
    }
}