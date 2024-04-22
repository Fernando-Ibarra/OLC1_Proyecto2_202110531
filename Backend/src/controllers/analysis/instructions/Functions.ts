import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';
import Return from './Return';


export default class Functions extends Instruction {
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
            console.log("FUNCTIONS: ", i)
            if (i instanceof Return) {
                console.log("FUNCTION - IF", i)
                return i
            }
            let result = i.interpret(tree, table)
            if (result instanceof Error) return result;
            if (result instanceof Return) {
                let resultCall = result.interpret(tree, table)
                return resultCall
            };
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_Function${this.nodeName}`
        let ast = `${newFather}[label="FUNCTION INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`;


        ast += `node_Function${this.nodeName}_MT [label="${ this.getTypeString(this.typeData.getTypeData()) }"]\n`;
        ast += `node_Function${this.nodeName}_ID[label="ID"]\n`;
        ast += `node_Function${this.nodeName}_LP[label="("]\n`;
        ast += `node_Function${this.nodeName}_PARM[label="PARAMS"]\n`;
        ast += `node_Function${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Function${this.nodeName}_LB[label="{"]\n`;
        ast += `node_Function${this.nodeName}_INSTRUCTIONS [label="INSTRUCTIONS"]\n`;
        ast += `node_Function${this.nodeName}_RB[label="}"]\n`;


        ast += `${newFather} -> node_Function${this.nodeName}_MT\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_PARM\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_INSTRUCTIONS\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_RB\n`;

        ast += `node_Function${this.nodeName}_ID_NAME [label="${this.id}"]\n`;        
        ast += `node_Function${this.nodeName}_ID -> node_Function${this.nodeName}_ID_NAME\n`;
        

        
        
        for(let i of this.instructions) {
            ast += i.ast(`node_Function${this.nodeName}_INSTRUCTIONS`)
        }
        
        return ast
    }

    getTypeString(tpd: typeData): string {
        if (tpd == typeData.BOOL) {
            return "bool";
        } else if (tpd == typeData.CHAR) {
            return "char";
        } else if (tpd == typeData.FLOAT) {
            return "double"
        } else if (tpd == typeData.STRING) {
            return "std::string";
        } else  if (tpd == typeData.INT) {
            return "int"
        } else {
            return "void";
        }
    }
}