import { Instruction, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Return extends Instruction {
    private expression: Instruction | undefined;

    constructor(row: number, column: number, expression?: Instruction) {
        super(new TypeD(typeData.VOID), row, column)
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable) {
        if (this.expression) {
            let result = this.expression.interpret(tree, table);
            if (result instanceof Error) return result
            return result;
        } else {
            return;
        }
    }
}