import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class Declaration extends Instruction {
    private id: string[];
    private value: Instruction | undefined;

    constructor(typeV: TypeD, row: number, column: number, id: string[], value?: Instruction) {
        super(typeV, row, column)
        if (!value) {
            this.id = id
        } else {
            this.id = id
            this.value = value
        }
    }

    interpret(tree: Tree, table: SymbolTable) {
        for (let i = 0; i < this.id.length; i++) {
            let id = this.id[i]
            if (!this.value) {
                if (!table.setVariable(new Symbol(this.typeData, id, null))) {
                    return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
                }
                return
            } else {
                console.log("DECLARATION VALUE Be", this.value)
                let NewValue = this.value.interpret(tree, table)
                console.log("DECLARATION VALUE Af", NewValue)
                if (NewValue instanceof Error) return NewValue
                
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new Error('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
                }
            
                if (!table.setVariable(new Symbol(this.typeData, id, NewValue))) {
                    return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
                }
                console.log("TABLE DECLA", table)
            }
        }
        
    }

    ast(fatherNode: string): string {
        return ""
    }
}