import { SymbolTable, Tree, Instruction, typeData } from '..';
import TypeD from '../symbols/TypeD';

export default class Nativo extends Instruction {
    value: any;
    private nameNode: string;

    constructor( type: TypeD, value: any, line: number, column: number){
        super(type, line, column);
        this.value = value;
        this.nameNode = `Nativo${line}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        if (this.typeData.getTypeData() == typeData.BOOL ) {
            return this.value == 'true' ? true : false;
        }
        if (this.typeData.getTypeData() == typeData.STRING) {
            let val = this.value.toString();
            this.value = val.replace('\\n', '\n').replace('\\t', '\t').replace('\\r', '\r').replace('\\\\', '\\').replace("\\'","'").replace('\\"', '"');
        }
        return this.value;
    }

    ast(fatherNode: string): string {
        let ast = `node${this.nameNode}[label="${this.value}"]\n`
        ast +=  `${fatherNode} -> node${this.nameNode}\n`
        return ast
    }
    
}