import { SymbolTable, Tree, Instruction, Error, typeData } from '../';
import TypeD from '../symbols/TypeD';

export default class Logicas extends Instruction {
    private leftOperand: Instruction | undefined;
    private rightOperand: Instruction | undefined;
    private Logica: LogicasOption;
    private uniqueOperand: Instruction | undefined;

    constructor(Logica: LogicasOption, row: number, column: number, leftOperand: Instruction, rightOperand?: Instruction){
        super(new TypeD(typeData.INT), row, column);
        this.Logica = Logica;
        if (!rightOperand) {
            this.uniqueOperand = leftOperand;
        } else {
            this.leftOperand = leftOperand;
            this.rightOperand = rightOperand;
        }
    }

    interpret(tree: Tree, table: SymbolTable) {
        let leftOp, rightOp, uniqueOp = null;
        if ( this.uniqueOperand != null ) {
            uniqueOp = this.uniqueOperand.interpret(tree, table);
            if (uniqueOp instanceof Error) return uniqueOp;
        } else {
            leftOp = this.leftOperand?.interpret(tree, table);
            if (leftOp instanceof Error) return leftOp;
            rightOp = this.rightOperand?.interpret(tree, table);
            if (rightOp instanceof Error) return rightOp;
        }

        switch (this.Logica) {
            case LogicasOption.AND:
                return this.and(leftOp, rightOp);
            case LogicasOption.OR:
                return this.or(leftOp, rightOp);
            case LogicasOption.NOT:
                return this.not(uniqueOp);
            default:
                return new Error('Semantico', `Operador lógico invalido`, this.row, this.column);
        }
    }

    or(leftOp: any, rightOp: any){}

    and(leftOp: any, rightOp: any){}

    not(operand:any){}

}

export enum LogicasOption {
    OR,
    AND,
    NOT
}