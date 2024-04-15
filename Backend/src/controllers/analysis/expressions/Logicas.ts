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

    or(leftOp: any, rightOp: any){
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp || rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede realizar la operacion OR`, this.row, this.column);
        }
    }

    and(leftOp: any, rightOp: any){
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp && rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede realizar la operacion AND`, this.row, this.column);
        }
    }

    not(operand:any){
        let firstOp = this.uniqueOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.BOOL:
                this.typeData = new TypeD(typeData.BOOL);
                return !operand;
            default:
                return new Error('Semantico', `No se puede realizar la operación NOT con ${firstOp}`, this.row, this.column);
        }
    }

}

export enum LogicasOption {
    OR,
    AND,
    NOT
}