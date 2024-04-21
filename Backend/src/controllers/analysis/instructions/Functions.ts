import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';
import Return from './Return';


export default class Functions extends Instruction {
    public id: string;
    public params: any[];
    public instructions: Instruction[];

    constructor(id: string[], tipoV: TypeD, instructions: Instruction[], row: number, column: number, params: any[]) {
        super(tipoV, row, column)
        this.id = id[0]
        this.params = params
        this.instructions = instructions
    }

    interpret(tree: Tree, table: SymbolTable) {
        for( let i of this.instructions) {
            console.log("FUNCTIONS: ", i)
            if (i instanceof Return) {
                console.log("FUNCTION - IF", i)
                return i
            }
            let result = i.interpret(tree, table)
            if (result instanceof Error) return result;
            if (result instanceof Return) {
                console.log("FUNCTION - RESULT - IF", result)
                let resultCall = result.interpret(tree, table)
                return resultCall
            };
        }
    }

    ast(fatherNode: string): string {
        let ast = `node_${this.row}_${this.column}[label="Function"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}\n`
        ast += `node_${this.row}_${this.column}_1[label="id: ${this.id}"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}_1\n`
        ast += `node_${this.row}_${this.column}_2[label="params"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}_2\n`
        // for(let i of this.params) {
        //     ast += i.ast(`node_${this.row}_${this.column}_2`)
        // }
        ast += `node_${this.row}_${this.column}_3[label="instructions"]\n`
        ast += `${fatherNode} -> node_${this.row}_${this.column}_3\n`
        for(let i of this.instructions) {
            ast += i.ast(`node_${this.row}_${this.column}_3`)
        }
        
        return ast
    }
}