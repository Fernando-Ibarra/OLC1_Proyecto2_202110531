import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';
import Return from './Return';

export default class Method extends Instruction {
    public id: string;
    public params: any[];
    public instructions: Instruction[];
    private nodeName: string;

    constructor(id: string[], tipoV: TypeD, instructions: Instruction[], row: number, column: number, params: any[]) {
        super(tipoV, row, column)
        this.id = id[0]
        this.params = params
        this.instructions = instructions
        this.nodeName = `${row}_${column}`
    }

    interpret(tree: Tree, table: SymbolTable) {
        for( let i of this.instructions) {
            let result = i.interpret(tree, table)
            if (result instanceof Error) return result;
            if (result instanceof Return) break;
        }
    }

    ast(fatherNode: string) {
        let newFather = `node_Method${this.nodeName}`
        let ast = `${newFather}[label="METHOD INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`;


        ast += `node_Method${this.nodeName}_MT [label="VOID"]\n`;
        ast += `node_Method${this.nodeName}_ID[label="ID"]\n`;
        ast += `node_Method${this.nodeName}_LP[label="("]\n`;
        ast += `node_Method${this.nodeName}_PARM[label="PARAMS"]\n`;
        ast += `node_Method${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Method${this.nodeName}_LB[label="{"]\n`;
        ast += `node_Method${this.nodeName}_INSTRUCTIONS [label="INSTRUCTIONS"]\n`;
        ast += `node_Method${this.nodeName}_RB[label="}"]\n`;


        ast += `${newFather} -> node_Method${this.nodeName}_MT\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_PARM\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_INSTRUCTIONS\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_RB\n`;

        ast += `node_Method${this.nodeName}_ID_NAME [label="${this.id}"]\n`;        
        ast += `node_Method${this.nodeName}_ID -> node_Method${this.nodeName}_ID_NAME\n`;
        

        
        
        for(let i of this.instructions) {
            ast += i.ast(`node_Method${this.nodeName}_INSTRUCTIONS`)
        }
        
        return ast
    }
}