import { SymbolTable, Tree, Instruction, typeData, Symbol } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';


export default class AccessVar extends Instruction {
    private id: string;
    private nodeName: string;

    constructor(id: string, row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.id = id;
        this.nodeName = `${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let valueVar: Symbol = <Symbol>table.getVariable(this.id);
        if (valueVar == null) {
            return new Error('Semantico', `Acceso invalido`, this.row, this.column);
        }
        this.typeData = valueVar.getType();
        return valueVar.getValue();
    }

    ast(fatherNode: string): string {
        let nodeVar = `node_Var${this.nodeName}`;
        let ast = `${ nodeVar }[label="${ this.id }"]\n`
        ast += `${fatherNode} -> ${nodeVar}\n`
        return ast
    }

}