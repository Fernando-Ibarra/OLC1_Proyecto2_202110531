import { Error, Instruction, SymbolTable, Tree, typeData } from '../';
import TypeD from '../symbols/TypeD';

export default class Cout extends Instruction{
    private expression: Instruction;
    private endl: boolean;

    constructor(exp: Instruction, line: number, column: number, endl: boolean){
        super(new TypeD(typeData.VOID), line, column)
        this.expression = exp
        this.endl = endl;   
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
}