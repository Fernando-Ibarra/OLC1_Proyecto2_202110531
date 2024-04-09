import { Error, Instruction, SymbolTable, Tree, typeData } from '../';
import TypeD from '../symbols/TypeD';

export default class ToUpper extends Instruction{

    private expression: Instruction;

    constructor(exp: Instruction, line: number, column: number){
        super(new TypeD(typeData.STRING), line, column)
        this.expression = exp
    }

    interpret(tree: Tree, table: SymbolTable) {
        let value = this.expression.interpret(tree, table)
        if (value instanceof Error) return value

        if (value == null) return new Error('Semantico', `La variable ${value} no existe`, this.row, this.column);

        if (this.expression.typeData.getTypeData() != typeData.STRING) {
            return new Error('Semantico', `No se puede aplicar la función toupper a ${this.expression.typeData.getTypeData()}`, this.row, this.column);
        }

        this.typeData = new TypeD(typeData.STRING);
        return value.toLocaleUpperCase();
    }
}