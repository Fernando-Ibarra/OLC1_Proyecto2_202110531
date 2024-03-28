import { SymbolTable, Tree, Instruction, Error, typeData } from '..';
import TypeD from '../symbols/TypeD';

export default class Nativo extends Instruction {
    value: any;

    constructor( type: TypeD, value: any, line: number, column: number){
        super(type, line, column);
        this.value = value;
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
    
}