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
        let newFather = `node_Declaration${this.row}_${this.column}`;
        let ast = `${newFather}[label="DECLARATION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Declaration${this.row}_${this.column}_ID [label="ID"]\n`;
        ast += `node_Declaration${this.row}_${this.column}_TYPE [label="TYPE"]\n`;
        ast += `node_Declaration${this.row}_${this.column}_VALUE [label="VALUE"]\n`;
        ast += `node_Declaration${this.row}_${this.column}_SC [label=";"]\n`;
        ast += `${newFather} -> node_Declaration${this.row}_${this.column}_ID\n`;
        ast += `${newFather} -> node_Declaration${this.row}_${this.column}_TYPE\n`;
        ast += `${newFather} -> node_Declaration${this.row}_${this.column}_VALUE\n`;
        ast += `${newFather} -> node_Declaration${this.row}_${this.column}_SC\n`;

        for (let i of this.id) {
            ast += `node_Declaration${this.row}_${this.column}_ID${i} [label="${i}"]\n`
            ast += `node_Declaration${this.row}_${this.column}_ID -> node_Declaration${this.row}_${this.column}_ID${i}\n`
        }

        ast += `node_Declaration${this.row}_${this.column}_TYPE${this.typeData.getTypeData()} [label="${this.typeData.getTypeData()}"]\n`
        ast += `node_Declaration${this.row}_${this.column}_TYPE -> node_Declaration${this.row}_${this.column}_TYPE${this.typeData.getTypeData()}\n`

        if (this.value) {
            ast += this.value.ast(`node_Declaration${this.row}_${this.column}_VALUE`)
        }

        
        
        return ast;
    }
}