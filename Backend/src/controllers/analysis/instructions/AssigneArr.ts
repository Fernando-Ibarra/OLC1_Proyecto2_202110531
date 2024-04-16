import { Error, Instruction, Symbol, SymbolTable, Tree, typeData } from '../';
import TypeD from '../symbols/TypeD';

export default class AssigneArr extends Instruction {
    private id: string;
    private value: Instruction[][];

    constructor(id: string, value: Instruction[][], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.id = id;
        this.value = value;
    }


    interpret(tree: Tree, table: SymbolTable) {
        console.log('ASSIGNEARR', this.value)
    }

    ast(fatherNode: string): string {
        return ""
    }

}