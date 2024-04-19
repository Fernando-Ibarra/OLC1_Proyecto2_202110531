import { SymbolTable, Tree, Instruction, typeData, Symbol } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';


export default class AccessVar extends Instruction {
    private id: string;

    constructor(id: string, row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.id = id;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let valueVar: Symbol = <Symbol>table.getVariable(this.id);
        if (valueVar == null) {
            return new Error('Semantico', `Acceso invalido`, this.row, this.column);
        }
        this.typeData = valueVar.getType();
        console.log("valueVar", valueVar)
        console.log("valueVar", valueVar.getValue())
        return valueVar.getValue();
    }

    ast(father: string): string {
        return ""
    }

}