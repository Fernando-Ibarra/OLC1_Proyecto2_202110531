import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';

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
            if (this.value) {
                let NewValue = this.value.interpret(tree, table)
                if (NewValue instanceof Error) return NewValue
                
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new Error('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
                }
            
                if (!table.setVariable(new Symbol(this.typeData, id, NewValue))) {
                    return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
                }
            } else {
                if (!table.setVariable(new Symbol(this.typeData, id, this.defaultValues(this.typeData.getTypeData())))) {
                    return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
                }
            }
        }
        
    }

    defaultValues(typeV: typeData): any {
        switch (typeV) {
            case typeData.INT:
                return 0
            case typeData.FLOAT:
                return 0.0
            case typeData.CHAR:
                return ''
            case typeData.BOOL:
                return true
        }
    }

    ast(fatherNode: string): string {
        let ast = 'node' + this.row + '_' + this.column + '[label="\\<Instruccion\\>\\nDeclaracion"];\n';
        ast += fatherNode + ' -> node' + this.row + '_' + this.column + ';\n';
        if (this.value) {
            ast += 'node' + this.row + '_' + this.column + ' -> node' + this.value.row + '_' + this.value.column + ';\n';
            ast += this.value.ast('node' + this.row + '_' + this.column);
        }
        return ast;
    }
}