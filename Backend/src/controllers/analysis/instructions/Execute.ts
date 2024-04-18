import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Declaration from './Declaration';
import Method from './Method';

export default class Execute extends Instruction {
    private id: string;
    private params: Instruction[];

    constructor(id: string, row: number, column: number, params: Instruction[]) {
        super(new TypeD(typeData.VOID), row, column)
        this.id = id
        this.params = params
    }

    interpret(tree: Tree, table: SymbolTable) {
        let seek = tree.getFunction(this.id)
        if (seek == null) {
            return new Error('Semantico', `No existe la funcion`, this.row, this.column)
        }

        if ( seek instanceof Method ) {
            let newTable = new SymbolTable(tree.getGlobalTable())
            newTable.setName("Execute")

            if( seek.params.length != this.params.length ) {
                return new Error('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column)
            }

            for(let i=0; i < seek.params.length; i++) {
                let paramDeclared = new Declaration(seek.params[i].typeDa, this.row, this.column, seek.params[i].id, this.params[i])
                let result = paramDeclared.interpret(tree, newTable)
                if (result instanceof Error) return result
            }

            let result: any = seek.interpret(tree, newTable)
            if (result instanceof Error) return result

        }
    }

    ast(father: string) {
        return ""
    }
}