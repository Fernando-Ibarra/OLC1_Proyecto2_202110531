import { Error, Instruction, SymbolTable, Tree, typeData } from '../';
import TypeD from '../symbols/TypeD';

export default class Cout extends Instruction{
    private expression: Instruction;
    private endl: boolean;
    private nameNode: string;

    constructor(exp: Instruction, line: number, column: number, endl: boolean){
        super(new TypeD(typeData.VOID), line, column)
        this.expression = exp
        this.endl = endl;
        this.nameNode = `Cout${ line }_${ column }` 
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

    ast(father: string) {
        let ast = `node_Cout${ this.nameNode }[label="cout"]\n`
        ast += `node_CoutLP${ this.nameNode } [label="("]\n` 
        ast += this.expression.ast(`node_Cout${ this.nameNode }`)
        ast += `node_CoutRP${ this.nameNode } [label=")"]\n` 
        ast += `node_Cout${ this.nameNode } -> node_CoutLP${ this.nameNode }\n`
        ast += `node_Cout${ this.nameNode } -> node_CoutRP${ this.nameNode } \n`
        ast += `${ father } -> node_Cout${ this.nameNode } \n`
        return ast
    }
}