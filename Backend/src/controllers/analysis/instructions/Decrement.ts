import { Error, Instruction, SymbolTable, Tree, typeData } from '../';
import TypeD from '../symbols/TypeD';

export default class Decrement extends Instruction {
    private id: string;

    constructor(id: string, line: number, column: number) {
        super(new TypeD(typeData.VOID), line, column)
        this.id = id[0]
    }

    interpret(tree: Tree, table: SymbolTable) {
        let value = table.getVariable(this.id.toLocaleLowerCase())
        if (value == null) return new Error('Semantico', `La variable ${this.id} no existe`, this.row, this.column)
        if (value.getType().getTypeData() != typeData.INT) {
            return new Error('Semantico', `No se puede decrementar la variable ${this.id} porque no es de tipo number`, this.row, this.column)
        }
        this.typeData = value.getType()
        value.setValue(parseInt(value.getValue()) - 1)
    }
}