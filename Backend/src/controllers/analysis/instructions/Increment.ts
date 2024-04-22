import {Instruction, SymbolTable, Tree, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class Increment extends Instruction {
    private id: string;
    private nodeName: string

    constructor(id: string, line: number, column: number) {
        super(new TypeD(typeData.VOID), line, column)
        this.id = id[0]
        this.nodeName = `${this.row}_${this.column}`
    }

    interpret(tree: Tree, table: SymbolTable) {
        let value = table.getVariable(this.id.toLocaleLowerCase())
        if (value == null) return new Error('Semantico', `La variable ${this.id} no existe`, this.row, this.column)
            if (value.getType().getTypeData() != typeData.INT) {
            return new Error('Semantico', `No se puede decrementar la variable ${this.id} porque no es de tipo number`, this.row, this.column)
        }
        this.typeData = value.getType()
        value.setValue(parseInt(value.getValue()) + 1)
    }

    ast(fatherNode: string): string {
        let newFather = `node_INCREMENT${ this.nodeName }`
        let ast = `${newFather}[label="INCREMENT INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`

        ast += `node_INCREMENT${this.nodeName}_ID [label="${this.id}"]\n`
        ast += `node_INCREMENT${this.nodeName}_PLUS1 [label="+"]\n`
        ast += `node_INCREMENT${this.nodeName}_PLUS2 [label="+"]\n`
        ast += `node_INCREMENT${this.nodeName}_SC [label=";"]\n`

        ast += `${newFather} -> node_INCREMENT${this.nodeName}_ID\n`
        ast += `${newFather} -> node_INCREMENT${this.nodeName}_PLUS1\n`
        ast += `${newFather} -> node_INCREMENT${this.nodeName}_PLUS2\n`
        ast += `${newFather} -> node_INCREMENT${this.nodeName}_SC\n`
        
        return ast
    }

}