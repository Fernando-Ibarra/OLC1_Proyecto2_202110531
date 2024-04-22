import { Instruction, SymbolTable, Tree, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class ToUpper extends Instruction{

    private expression: Instruction;
    private nodeName: string;

    constructor(exp: Instruction, line: number, column: number){
        super(new TypeD(typeData.STRING), line, column)
        this.expression = exp
        this.nodeName = `ToUpper${line}_${column}`
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

    ast(fatherNode: string): string {
        let newFather = `node_Upper${this.nodeName}`
        let ast = `${newFather}[label="TOUPPER INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`;

        // BODY
        ast += `node_Upper${this.nodeName}_RD [label="toupper"]\n`;
        ast += `node_Upper${this.nodeName}_LP [label="("]\n`;
        ast += `node_Upper${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_Upper${this.nodeName}_RP [label=")"]\n`;
        ast += `node_Upper${this.nodeName}_SC [label=";"]\n`;

        ast += `${newFather} -> node_Upper${this.nodeName}_RD\n`;
        ast += `${newFather} -> node_Upper${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Upper${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_Upper${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Upper${this.nodeName}_SC\n`;

        // EXPRESSION
        ast += this.expression.ast(`node_Upper${this.nodeName}_EXPRESION`)

        return ast
    }
}