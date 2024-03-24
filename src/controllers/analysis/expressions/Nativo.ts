import { SymbolTable, Tree, TypeD, Instruction, Error, typeData } from '..';

export class Nativo extends Instruction {
    value: any;

    constructor( type: TypeD, value: any, line: number, column: number){
        super(type, line, column);
        this.value = value;
    }

    interpret(tree: Tree, table: SymbolTable) {
        return this.value;
    }
    
}