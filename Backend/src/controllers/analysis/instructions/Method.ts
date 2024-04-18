import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';
import Return from './Return';

export default class Method extends Instruction {
    public id: string;
    public params: any[];
    public instructions: Instruction[];

    constructor(id: string, tipoV: TypeD, instructions: Instruction[], row: number, column: number, params: any[]) {
        super(tipoV, row, column)
        this.id = id
        this.params = params
        this.instructions = instructions
    }

    interpret(tree: Tree, table: SymbolTable) {
        for( let i of this.instructions) {
            let result = i.interpret(tree, table)
            if (result instanceof Error) return result;
            if (result instanceof Return) break;
        }
    }

    ast() {
        return ""
    }
}