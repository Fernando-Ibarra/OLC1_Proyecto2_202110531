import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Call from './Call';

export default class Declaration extends Instruction {
    private id: string[];
    private value: Instruction | undefined;
    private nodeName: string;

    constructor(typeV: TypeD, row: number, column: number, id: string[], value?: Instruction) {
        super(typeV, row, column)
        if (!value) {
            this.id = id
        } else {
            this.id = id
            this.value = value
        }
        this.nodeName = `${row}_${column}`
    }

    interpret(tree: Tree, table: SymbolTable) {
        for (let i = 0; i < this.id.length; i++) {
            let id = this.id[i]
            if (this.value) {
                console.log(`id: ${id} value: ${ this.value }` )
                let NewValue = this.value.interpret(tree, table)
                console.log(`id: ${id} newValue: ${ NewValue }` )
                if (NewValue instanceof Error) return NewValue
                
                console.log(`id: ${id} valueCon1: ${ NewValue }` )
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new Error('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
                }
            
                console.log(`id: ${id} valueCon2: ${ NewValue }` )
                if (!table.setVariable(new Symbol(this.typeData, id, NewValue))) {
                    return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
                }
                console.log(`id: ${id} valueInter: ${ NewValue }` )
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
        let newFather = `node_Declaration${this.nodeName}`;
        let ast = `${newFather}[label="DECLARATION INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Declaration${this.nodeName}_TYPE [label="TYPE"]\n`;
        ast += `node_Declaration${this.nodeName}_ID [label="ID"]\n`;
        ast += `node_Declaration${this.nodeName}_EQ [label="="]\n`;
        ast += `node_Declaration${this.nodeName}_VALUE [label="VALUE"]\n`;
        ast += `node_Declaration${this.nodeName}_SC [label=";"]\n`;


        ast += `${newFather} -> node_Declaration${this.nodeName}_TYPE\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_EQ\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_VALUE\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_SC\n`;

        for (let i of this.id) {
            ast += `node_Declaration${this.nodeName}_ID${i} [label="${i}"]\n`
            ast += `node_Declaration${this.nodeName}_ID -> node_Declaration${this.nodeName}_ID${i}\n`
        }

        ast += `node_Declaration${this.nodeName}_TYPE${this.typeData.getTypeData()} [label="${ this.getTypeString(this.typeData.getTypeData()) }"]\n`
        ast += `node_Declaration${this.nodeName}_TYPE -> node_Declaration${this.nodeName}_TYPE${this.typeData.getTypeData()}\n`

        if (this.value) {
            ast += this.value.ast(`node_Declaration${this.nodeName}_VALUE`)
        }

        
        
        return ast;
    }

    getTypeString(tpd: typeData): string {
        if (tpd == typeData.BOOL) {
            return "bool";
        } else if (tpd == typeData.CHAR) {
            return "char";
        } else if (tpd == typeData.FLOAT) {
            return "double"
        } else if (tpd == typeData.STRING) {
            return "std::string";
        } else  if (tpd == typeData.INT) {
            return "int"
        } else {
            return "void";
        }
        
    }
}