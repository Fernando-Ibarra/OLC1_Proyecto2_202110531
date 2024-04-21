import { Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD from '../symbols/TypeD';

export default class DeclarationArr extends Instruction {
    private id: string;
    private value: Instruction[][];
    private valueArr: any[] = []

    constructor(typeV: TypeD,  id: string, value: Instruction[][], row: number, column: number) {
        super(typeV, row, column)
        this.id = id
        this.value = value
    }

    interpret(tree: Tree, table: SymbolTable) {

        // this.valueArr = this.value.map(
        //     (arr) => arr.map(
        //         (val) => {
        //             let value = val.interpret(tree, table)
        //             if (value instanceof Error) return value
        //             return value
        //         }
        //     )
        // )
        // let id = this.id[0]
        // if (!table.setVariable(new Symbol(this.typeData, id, this.valueArr))) {
        //     return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
        // }
    }

    ast(fatherNode: string): string {
        return ""
    }

}