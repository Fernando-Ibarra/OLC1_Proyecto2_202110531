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
    private nameNode: string;

    constructor(id: string, row: number, column: number, params: Instruction[]) {
        super(new TypeD(typeData.VOID), row, column)
        this.id = id
        this.params = params
        this.nameNode = `${row}_${column}`;
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
        // HEAD
        let newFather = `node_Call${this.nameNode}`;
        let ast = `${newFather}[label="CALL INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`

        // CALL
        ast += `node_Call${this.nameNode}_CALL [label="${this.id}"]\n`
        ast += `node_Call${this.nameNode}_LP [label="("]\n`;
        ast += `node_Call${this.nameNode}_PARM [label="PARAMS"]\n`;
        ast += `node_Call${this.nameNode}_RP [label=")"]\n`;

        ast += `${newFather} -> node_Call${this.nameNode}_CALL\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_LP\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_PARM\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_RP\n`;

        if (this.params.length > 0) {
            for (let i of this.params) {
                ast += i.ast(`node_Call${this.nameNode}_PARM`)
            }
        }

        return ast;
    }
}