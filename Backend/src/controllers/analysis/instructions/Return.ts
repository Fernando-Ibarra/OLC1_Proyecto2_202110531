import { Instruction, SymbolTable, Tree } from '../';
import AccessVar from '../expressions/AccessVar';
import TypeD, { typeData } from '../symbols/TypeD';
import Call from './Call';

export default class Return extends Instruction {
    private expression: Instruction | undefined;
    private nodeName: string;

    constructor(row: number, column: number, expression?: Instruction) {
        super(new TypeD(typeData.VOID), row, column)
        this.expression = expression;
        this.nodeName = `${row}_${column}`
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
        let newFather = `node_Return${ this.nodeName }`
        let ast = `${newFather}[label="RETURN INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Return${this.nodeName}_SC [label=";"]\n`;

        if (this.expression) {
            ast += this.expression.ast(newFather)
        }

        ast += `${fatherNode} -> node_Return${this.nodeName}_SC\n`

        return ast;
    }
}