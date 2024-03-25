import { SymbolTable, Tree, Instruction, Error, typeData } from '..';
import TypeD from '../symbols/TypeD';

export default class Nativo extends Instruction {
    value: any;

    constructor( type: TypeD, value: any, line: number, column: number){
        super(type, line, column);
        this.value = value;
    }

    interpret(tree: Tree, table: SymbolTable) {
        return this.value;
    }
    
}