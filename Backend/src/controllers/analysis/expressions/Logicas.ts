import { SymbolTable, Tree, Instruction, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class Logicas extends Instruction {
    private leftOperand: Instruction | undefined;
    private rightOperand: Instruction | undefined;
    private Logica: LogicasOption;
    private uniqueOperand: Instruction | undefined;
    private nameNode: string;

    constructor(Logica: LogicasOption, row: number, column: number, leftOperand: Instruction, rightOperand?: Instruction){
        super(new TypeD(typeData.INT), row, column);
        this.Logica = Logica;
        if (!rightOperand) {
            this.uniqueOperand = leftOperand;
        } else {
            this.leftOperand = leftOperand;
            this.rightOperand = rightOperand;
        }
        this.nameNode = `${row}_${column}`;
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

    ast(fatherNode: string): string {
        // HEAD
        let newFather = `node_Logicas${this.nameNode}`
        let ast = `${newFather}[label="LOGICA INSTRUCTION"]\n`
        ast += `${fatherNode} -> ${newFather}\n`
        
        if ( this.uniqueOperand != null ) {
            ast += `node_Rela_Lo${this.nameNode} [label="${this.getLogica(this.Logica)}"]\n`
            ast += `nodeuniOp_Lo${this.nameNode} [label="${this.uniqueOperand}"]\n`

            ast += `${newFather} -> node_Rela_Lo${this.nameNode}\n`
            ast += `${newFather} -> nodeuniOp_Lo${this.nameNode}\n`
        } else {
            ast += `nodeLeft_Lo${this.nameNode} [label="valor1"]\n`
            ast += `node_Rela_Lo${this.nameNode} [label="${this.getLogica(this.Logica)}"]\n`
            ast += `nodeRight_Lo${this.nameNode} [label="valor2"]\n`
            ast += `${newFather} -> nodeLeft_Lo${this.nameNode}\n`
            ast += `${newFather} -> node_Rela_Lo${this.nameNode}\n`
            ast += `${newFather} -> nodeRight_Lo${this.nameNode}\n`

            ast += this.leftOperand?.ast(`nodeLeft_Lo${this.nameNode}`);
            ast += this.rightOperand?.ast(`nodeRight_Lo${this.nameNode}`);
        }
        return ast
    }

    getLogica(loOpt: LogicasOption): string {
        switch (loOpt) {
            case LogicasOption.AND:
                return "&&";
            case LogicasOption.OR:
                return "||";
            case LogicasOption.NOT:
                return "!";
        }
    }

}

export enum LogicasOption {
    OR,
    AND,
    NOT
}