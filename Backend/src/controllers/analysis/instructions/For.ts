import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';
import Break from './Break';
import Continue from './Continue';
import Return from './Return';

export default class For extends Instruction {
    private declaration: Instruction;
    private condition: Instruction;
    private increment: Instruction;
    private instructions: Instruction[];
    private nodeName: string;

    constructor(declaration: Instruction, condition: Instruction, increment: Instruction, instructions: Instruction[], row: number, column: number) {
        super(new TypeD(typeData.VOID), row, column);
        this.declaration = declaration;
        this.condition = condition;
        this.increment = increment;
        this.instructions = instructions;
        this.nodeName = `For${row}_${column}`;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let newTable = new SymbolTable(table);
        let dec = this.declaration.interpret(tree, newTable);
        if (dec instanceof Error) return dec;

        let cond = this.condition.interpret(tree, newTable);
        if (cond instanceof Error) return cond;

        if (this.condition.typeData.getTypeData() != typeData.BOOL) {
            return new Error("Semántico", "Se esperaba una expresión booleana en la condición del for", this.row, this.column);
        }

        let conditionValue = this.condition.interpret(tree, newTable);

        while(conditionValue == true) {
            for (let i of this.instructions) {
                console.log(i);
                if (i instanceof Break ) return;
                let result = i.interpret(tree, newTable);
                console.log(result);
                if (result instanceof Break) {
                    return;
                }
                if (result instanceof Continue) {
                    break;
                }
                if (result instanceof Error) {
                    return;
                }
                if (result instanceof Return) {
                    return result;
                }
            }
            let inc = this.increment.interpret(tree, newTable);
            if (inc instanceof Error) return inc;

            conditionValue = this.condition.interpret(tree, newTable);
        }
    }

    ast(fatherNode: string): string {
        let newFather = `node_For${this.nodeName}`;
        let ast = `${newFather}[label="For"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_For${this.nodeName}_1[label="Declaration"]\n`;
        ast += `${newFather} -> node_For${this.nodeName}_1\n`;
        ast += this.declaration.ast(`node_For${this.nodeName}_1`);
        ast += `node_For${this.nodeName}_2[label="Condition"]\n`;
        ast += `${newFather} -> node_For${this.nodeName}_2\n`;
        ast += this.condition.ast(`node_For${this.nodeName}_2`);
        ast += `node_For${this.nodeName}_3[label="Update"]\n`;
        ast += `${newFather} -> node_For${this.nodeName}_3\n`;
        ast += this.increment.ast(`node_For${this.nodeName}_3`);
        for (let i of this.instructions) {
            ast += i.ast(newFather);
        }
        return ast;
    }
}