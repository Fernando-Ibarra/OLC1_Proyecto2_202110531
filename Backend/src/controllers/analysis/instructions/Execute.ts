import { Console } from 'console';
import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Declaration from './Declaration';
import Method from './Method';
import Functions from './Functions';

export default class Execute extends Instruction {
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

        if ( seek instanceof Method) {
            let newTable = new SymbolTable(tree.getGlobalTable())
            newTable.setName("Execute")

            if( seek.params.length != this.params.length ) {
                return new Error('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column)
            }

            for(let i=0; i < seek.params.length; i++) {
                let paramDeclared = new Declaration(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id], this.params[i])
                let result = paramDeclared.interpret(tree, newTable)
                if (result instanceof Error) return result
            }

            let result: any = seek.interpret(tree, newTable)
            if (result instanceof Error) return result
        }

        if ( seek instanceof Functions ) {
            let newTable = new SymbolTable(tree.getGlobalTable())
            newTable.setName("Execute")

            if( seek.params.length != this.params.length ) {
                return new Error('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column)
            }

            for(let i=0; i < seek.params.length; i++) {
                let paramDeclared = new Declaration(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id], this.params[i])
                let result = paramDeclared.interpret(tree, newTable)
                if (result instanceof Error) return result
            }

            let result: any = seek.interpret(tree, newTable)
            if (result instanceof Error) return result
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_Execute${this.row}_${this.column}`;
        let ast = `${newFather}[label="EXECUTE INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Execute${this.row}_${this.column}_EX [label="Execute"]\n`;
        ast += `node_Execute${this.row}_${this.column}_ID[label="ID"]\n`;
        ast += `node_Execute${this.row}_${this.column}_LP[label="("]\n`;
        ast += `node_Execute${this.row}_${this.column}_PARM[label="PARAMS"]\n`;
        ast += `node_Execute${this.row}_${this.column}_RP[label=")"]\n`;
        ast += `node_Execute${this.row}_${this.column}_SC[label=";"]\n`;

        ast += `${newFather} -> node_Execute${this.row}_${this.column}_EX\n`;
        ast += `${newFather} -> node_Execute${this.row}_${this.column}_ID\n`;
        ast += `${newFather} -> node_Execute${this.row}_${this.column}_RP\n`;
        ast += `${newFather} -> node_Execute${this.row}_${this.column}_PARM\n`;
        ast += `${newFather} -> node_Execute${this.row}_${this.column}_LP\n`;
        ast += `${newFather} -> node_Execute${this.row}_${this.column}_SC\n`;

        for (let i of this.params) {
            ast += `node_Execute${this.row}_${this.column}_PARM_VAL${i} [label="${this.params}"]\n`
            ast += `node_Execute${this.row}_${this.column}_PARM -> node_Execute${this.row}_${this.column}_PARM_VAL${i}`
        }

        
        ast += `node_ID${this.row}_${this.column} [label="${this.id}"]\n`;        
        ast += `node_Execute${this.row}_${this.column}_ID -> node_ID${this.row}_${this.column}\n`;
        return ast
    }
}