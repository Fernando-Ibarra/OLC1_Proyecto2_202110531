import { SymbolTable, Tree, TypeD} from '../';

export abstract class Instruction {
    public typeData: TypeD;
    public row: number;
    public column: number;

    constructor(typeData: TypeD, row: number, column: number) {
        this.typeData = typeData;
        this.row = row;
        this.column = column;
    }

    abstract interpret(tree: Tree, table: SymbolTable): any;
}