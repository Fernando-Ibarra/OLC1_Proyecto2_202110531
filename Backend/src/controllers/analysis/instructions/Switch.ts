import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import Relacionales, { RelationalOption } from '../expressions/Relacionales';
import TypeD, { typeData } from '../symbols/TypeD';
import Case from './Case';
import Break from './Break';

export default class Switch extends Instruction {
    private expression: Instruction;
    private cases: Case[] | undefined;
    private default: Instruction | undefined;
    private defaultVal: boolean = false;
    private finished: boolean = false;
    private nodeName: string;

    constructor(expression: Instruction, row: number, column: number, cases?: Case[],defaultCase?: Instruction) {
        super(new TypeD(typeData.VOID), row, column);
        this.expression = expression;
        this.cases = cases;
        this.default = defaultCase;
        this.nodeName = `Switch${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let expression = this.expression.interpret(tree, table);
        if (expression instanceof Error) return expression;

        this.cases?.forEach(caseInstruction => {
            let expressionCase = caseInstruction.expression.interpret(tree, table);
            if (expressionCase instanceof Error) return expressionCase;

            if (expressionCase == expression) {
                let newTable = new SymbolTable(table);
                newTable.setName("Case Statement");
                let result = caseInstruction.interpret(tree, newTable);
                if (result instanceof Error) return result;
                if (result instanceof Break) {
                    this.finished = true;
                    this.defaultVal = false;
                    return result;
                }
            } else {
                this.defaultVal = true;
                return;
            }
            
        })

        if (this.defaultVal && !this.finished) {
            let newTable = new SymbolTable(table);
            newTable.setName("Default Statement");
            let result = this.default?.interpret(tree, newTable);
            if (result instanceof Error) return result;
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_Switch${this.nodeName}`;
        let ast = `${newFather}[label="Switch"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Switch${this.nodeName}_1[label="Expression"]\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_1\n`;
        ast += this.expression.ast(`node_Switch${this.nodeName}_1`);
        for (let i of this.cases || []) {
            ast += i.ast(newFather);
        }
        if (this.defaultVal && !this.finished) {
            if (this.default) {
                ast += this.default.ast(newFather);
            }
        }
        return ast;
    }
}