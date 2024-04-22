import { Instruction, SymbolTable, Tree, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class Cout extends Instruction{
    private expression: Instruction;
    private endl: boolean;
    private nameNode: string;

    constructor(exp: Instruction, line: number, column: number, endl: boolean){
        super(new TypeD(typeData.VOID), line, column)
        this.expression = exp
        this.endl = endl;
        this.nameNode = `${ line }_${ column }` 
    }

    interpret(tree: Tree, table: SymbolTable) {
       let value = this.expression.interpret(tree, table)
       if (value instanceof Error) return value
       if (this.endl) {
           value += '\n'
           tree.Cout(value)
       } else {
            tree.Cout(value)
       }
    }

    ast(fatherNode: string) {
        let newFather = `node_Cout${ this.nameNode }`;
        let ast = `${ newFather }[label="COUT INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`;


        ast += `node_Cout${this.nameNode}_COUT [label="COUT"]\n`;
        ast += `node_Cout${this.nameNode}_LP[label="("]\n`;
        ast += `node_Cout${this.nameNode}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_Cout${this.nameNode}_RP[label=")"]\n`;
        ast += `node_Cout${this.nameNode}_SC [label=";"]\n`;

        ast += `${newFather} -> node_Cout${this.nameNode}_COUT\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_LP\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_EXPRESION\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_RP\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_SC\n`;


        ast += this.expression.ast(`node_Cout${this.nameNode}_EXPRESION`)
        return ast
    }
}