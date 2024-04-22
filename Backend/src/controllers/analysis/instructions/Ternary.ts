import { Instruction, Symbol, SymbolTable, Tree } from '../';
import Error from '../exceptions/Errors';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Ternary extends Instruction {
    private condition: Instruction;
    private conditionTrue: Instruction;
    private conditionFalse: Instruction;
    private nodeName: string;

    constructor(condition: Instruction, conditionTrue: Instruction, conditionFalse: Instruction, row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.condition = condition;
        this.conditionTrue = conditionTrue;
        this.conditionFalse = conditionFalse;
        this.nodeName = `${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let cond = this.condition.interpret(tree, table);
        if (cond instanceof Error) return cond;

        if (this.condition.typeData.getTypeData() != typeData.BOOL) {
            return new Error("Semántico", "Se esperaba una expresión booleana en la condición del ternario", this.row, this.column);
        }

        if (cond) {
            this.typeData = this.conditionTrue.typeData;
            let value = this.conditionTrue.interpret(tree, table);
            if (value instanceof Error) return value;
            return value;
        } else {
            this.typeData = this.conditionFalse.typeData;
            let value = this.conditionFalse.interpret(tree, table);
            if (value instanceof Error) return value;
            return value;
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_Ternary${this.nodeName}`;
        let ast = `${newFather}[label="TERNARY INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;

        ast += `node_Ternary${this.nodeName}_LP[label="("]\n`;
        ast += `node_Ternary${this.nodeName}_CONDITION [label="CONDITION"]\n`;
        ast += `node_Ternary${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Ternary${this.nodeName}_IN[label="?"]\n`;
        ast += `node_Ternary${this.nodeName}_EXPRESION1 [label="EXPRESION"]\n`;
        ast += `node_Ternary${this.nodeName}_CL [label=":"]\n`;
        ast += `node_Ternary${this.nodeName}_EXPRESION2 [label="EXPRESION"]\n`;
        ast += `node_Ternary${this.nodeName}_SC [label=";"]\n`;

        ast += `${newFather} -> node_Ternary${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_CONDITION\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_IN\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_EXPRESION1\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_CL\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_EXPRESION2\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_SC\n`;
        
        ast += this.condition.ast(`node_Ternary${this.nodeName}_CONDITION`);
        ast += this.conditionTrue.ast(`node_Ternary${this.nodeName}_EXPRESION1`);
        ast += this.conditionFalse.ast(`node_Ternary${this.nodeName}_EXPRESION2`);

        return ast;
    }
}