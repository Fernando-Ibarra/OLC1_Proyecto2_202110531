import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Declaration from './Declaration';
import Method from './Method';

export default class Call extends Instruction {
    private id: string;
    private params: Instruction[];

    constructor(id: string[], row: number, column: number, params: Instruction[]) {
        super(new TypeD(typeData.VOID), row, column)
        this.id = id[0]
        this.params = params
    }

    interpret(tree: Tree, table: SymbolTable) {
        let seek = tree.getFunction(this.id)
        if (seek == null) {
            return new Error('Semantico', `No existe la funcion`, this.row, this.column)
        }

        if ( seek instanceof Method ) {
            let newTable = new SymbolTable(table)
            newTable.setName("Llamada a método " + this.id)

            if( seek.params.length != this.params.length ) {
                return new Error('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column)
            }

            for(let i=0; i < seek.params.length; i++) {
                console.log("i CALL", i)
                console.log("SEEK", seek.params[i].id)
                console.log("PARAMS", this.params[i])
                let param = new Declaration(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id], this.params[i])
                console.log("param CALL", param)
                let result = param.interpret(tree, newTable)
                console.log("result CALL", result)
                if (result instanceof Error) return result
            }

            let result: any = seek.interpret(tree, newTable)
            if (result instanceof Error) return result
        }

    }

    ast(fatherNode: string): string {
        let ast = `node_${this.row}_${this.column}[label="Call"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}\n`
        ast += `node_${this.row}_${this.column}_1[label="id: ${this.id}"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}_1\n`
        ast += `node_${this.row}_${this.column}_2[label="params"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}_2\n`
        for(let i of this.params) {
            ast += i.ast(`node_${this.row}_${this.column}_2`)
        }

        return ast;
    }
}