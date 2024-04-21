import { Instruction, SymbolTable, Tree } from '../';
import AccessVar from '../expressions/AccessVar';
import TypeD, { typeData } from '../symbols/TypeD';
import Call from './Call';

export default class Return extends Instruction {
    private expression: Instruction | undefined;

    constructor(row: number, column: number, expression?: Instruction) {
        super(new TypeD(typeData.VOID), row, column)
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable) {
        if (this.expression) {
            let result = this.expression.interpret(tree, table);
            if (result instanceof Error) return result
            if ( result instanceof Call ) {
                let valueCall: Instruction | any = result.interpret(tree, table)
                if (valueCall instanceof Error) return valueCall
                return valueCall
            }
            return result;
        } else {
            return;
        }
    }

    ast(fatherNode: string): string {
        let ast = `node_Return${ this.row }_${ this.column }[label="Return"]\n`
        if (this.expression) {
            ast += `node_Return${ this.row }_${ this.column } -> node_Expression${ this.expression.row }_${ this.expression.column }\n`
            ast += this.expression.ast(`Return${ this.row }_${ this.column }`)
        }
        ast += `${ fatherNode } -> node_Return${ this.row }_${ this.column }\n`
        return ast;
    }
}