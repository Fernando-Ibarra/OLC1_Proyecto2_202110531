import { Instruction, SymbolTable, Tree, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class AssigneVar extends Instruction {
    private id: string[];
    private expression: Instruction | undefined;

    constructor(id: string[], line: number, column: number,  exp?: Instruction) {
        super(new TypeD(typeData.VOID), line, column)
        if (!exp) {
            this.id = id
        } else {
            this.id = id
            this.expression = exp
        }
    }

    interpret(tree: Tree, table: SymbolTable) {
        for (let i = 0; i < this.id.length; i++) {
            let id = this.id[i];
            if (!this.expression) {
                let value = table.getVariable(id.toLocaleLowerCase())
                if (value == null) return new Error('Semantico', `La variable ${this.id} no existe`, this.row, this.column)
                this.typeData = value.getType()
            } else {
                let NewValue = this.expression.interpret(tree, table)
                if (NewValue instanceof Error) return NewValue

                let value = table.getVariable(id.toLocaleLowerCase())
                if (value == null) return new Error('Semantico', `La variable ${this.id} no existe`, this.row, this.column)
                
                if (this.expression.typeData.getTypeData() != value.getType().getTypeData()) {
                    return new Error('Semantico', `No se puede asignar el tipo ${this.expression.typeData.getTypeData()} a ${value.getType().getTypeData()}`, this.row, this.column)
                }
                this.typeData = value.getType()
                value.setValue(NewValue)
            }
            
        }
    }

    ast(fatherNode: string): string {
        return ""
    }
}