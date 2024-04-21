import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Declaration from './Declaration';
import Functions from './Functions';
import Method from './Method';
import Return from './Return';

export default class Call extends Instruction {
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

        if ( seek instanceof Method) {
            let newTable = new SymbolTable(tree.getGlobalTable())
            newTable.setName("Llamada a método " + this.id)

            if( seek.params.length != this.params.length ) {
                return new Error('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column)
            }

            for(let i=0; i < seek.params.length; i++) {
                let param = new Declaration(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id])
                
                let result = param.interpret(tree, newTable)
                if (result instanceof Error) return result

                let value = this.params[i].interpret(tree, table)
                if (value instanceof Error) return value

                let updateVar = newTable.getVariable(seek.params[i].id)
                if (updateVar == null) {
                    return new Error('Semantico', `No existe la variable ${seek.params[i].id}`, this.row, this.column)
                }
                if (updateVar.getType().getTypeData() != this.params[i].typeData.getTypeData() ) {
                    return new Error('Semantico', `El tipo de dato no coincide con el parametro`, this.row, this.column)
                }

                updateVar.setValue(value)
            }

            let result: any = seek.interpret(tree, newTable)
            if (result instanceof Error) return result
        }

        if ( seek instanceof Functions ) {
            let newTable = new SymbolTable(tree.getGlobalTable())
            newTable.setName("Llamada a Funcion " + this.id)

            if( seek.params.length != this.params.length ) {
                return new Error('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column)
            }

            for(let i=0; i < seek.params.length; i++) {
                let param = new Declaration(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id])
                
                let result = param.interpret(tree, newTable)
                if (result instanceof Error) return result

                let value = this.params[i].interpret(tree, table)
                if (value instanceof Error) return value

                let updateVar = newTable.getVariable(seek.params[i].id)
                if (updateVar == null) {
                    return new Error('Semantico', `No existe la variable ${seek.params[i].id}`, this.row, this.column)
                }

                updateVar.setValue(value)
                console.log(`VAR UPDATE ${ updateVar.getId() } VALUE: `, updateVar.getValue())
            }

            let result: any = seek.interpret(tree, newTable)
            this.typeData = seek.typeData
            if ( result instanceof Return ) {
                return result
            }
            if (result instanceof Error) return result
            return result
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
            // ast += i.ast(`node_${this.row}_${this.column}_2`)
        }

        return ast;
    }
}