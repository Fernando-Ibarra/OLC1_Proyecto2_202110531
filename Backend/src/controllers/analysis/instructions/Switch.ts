import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
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
        this.nodeName = `${row}_${column}`;
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
        let ast = `${newFather}[label="SWITCH INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Switch${this.nodeName}_SWH [label="switch"]\n`;
        ast += `node_Switch${this.nodeName}_LP[label="("]\n`;
        ast += `node_Switch${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_Switch${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Switch${this.nodeName}_LB[label="{"]\n`;
        ast += `node_Switch${this.nodeName}_CASES_LIST  [label="CASES_LIST"]\n`;
        ast += `node_Switch${this.nodeName}_DEFAULT  [label="DEFAULT"]\n`;
        ast += `node_Switch${this.nodeName}_RB[label="}"]\n`;

        ast += `${newFather} -> node_Switch${this.nodeName}_SWH\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_CASES_LIST\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_DEFAULT\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_RB\n`;

        ast += this.expression.ast(`node_Switch${this.nodeName}_EXPRESION`)


        for (let i of this.cases || []) {
            ast += i.ast(`node_Switch${this.nodeName}_CASES_LIST`);
        }

        if (this.default) {
            ast += this.default.ast(`node_Switch${this.nodeName}_DEFAULT`);
        }
        return ast;
    }
}