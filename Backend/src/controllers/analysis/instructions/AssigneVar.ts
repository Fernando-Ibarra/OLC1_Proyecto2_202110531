import { Instruction, SymbolTable, Tree, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class AssigneVar extends Instruction {
    private id: string[];
    private expression: Instruction | undefined;
    private nodeName: string;

    constructor(id: string[], line: number, column: number,  exp?: Instruction) {
        super(new TypeD(typeData.VOID), line, column)
        if (!exp) {
            this.id = id
        } else {
            this.id = id
            this.expression = exp
        }
        this.nodeName = `${line}_${column}`
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
        let newFather = `node_ASSIGN${ this.nodeName }`
        let ast = `${newFather}[label="ASSIGN INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`

        ast += `node_ASSIGN${this.nodeName}_ID [label="ID"]\n`;
        ast += `node_ASSIGN${this.nodeName}_EQ [label="="]\n`;
        ast += `node_ASSIGN${this.nodeName}_VALUE [label="VALUE"]\n`;
        ast += `node_ASSIGN${this.nodeName}_SC [label=";"]\n`;


        ast += `${newFather} -> node_ASSIGN${this.nodeName}_TYPE\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_EQ\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_VALUE\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_SC\n`;

        for (let i of this.id) {
            ast += `node_ASSIGN${this.nodeName}_ID${i} [label="${i}"]\n`
            ast += `node_ASSIGN${this.nodeName}_ID -> node_ASSIGN${this.nodeName}_ID${i}\n`
        }

        if (this.expression) {
            ast += this.expression.ast(`node_ASSIGN${this.nodeName}_VALUE`)
        }

        return ast

    }
}