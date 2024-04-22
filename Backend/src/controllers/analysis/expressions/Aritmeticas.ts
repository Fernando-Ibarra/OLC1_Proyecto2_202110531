import { parse } from 'path';
import { SymbolTable, Tree, Instruction, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';

export default class Aritmeticas extends Instruction {
    private leftOperand: Instruction | undefined;
    private rightOperand: Instruction | undefined;
    private operator: ArithmeticOption;
    private uniqueOperand: Instruction | undefined;
    private nameNode: string;

    constructor(operator: ArithmeticOption, row: number, column: number, leftOperand: Instruction, rightOperand?: Instruction) {
        super(new TypeD(typeData.INT), row, column);
        this.operator = operator;
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

        switch (this.operator) {
            case ArithmeticOption.PLUS:
                return this.plus(leftOp, rightOp);
            case ArithmeticOption.MINUS:
                return this.minus(leftOp, rightOp);
            case ArithmeticOption.TIMES:
                return this.times(leftOp, rightOp);
            case ArithmeticOption.DIV:
                return this.div(leftOp, rightOp);
            case ArithmeticOption.MOD:
                return this.mod(leftOp, rightOp);
            case ArithmeticOption.POWER:
                return this.power(leftOp, rightOp);
            case ArithmeticOption.NEGATIVE:
                return this.negative(uniqueOp);
            default:
                return new Error('Semantico', `Operador aritmetico invalido`, this.row, this.column);
        }
    }

    plus(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) + parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) + parseInt((rightOp ? 1 : 0).toString());
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) + parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.STRING);
                        return parseInt(leftOp) + rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }       
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat((rightOp ? 1 : 0).toString());
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.STRING);
                        return parseFloat(leftOp) + rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt((leftOp ? 1 : 0).toString()) + parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat((leftOp ? 1 : 0).toString()) + parseFloat(rightOp);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede realizar la suma entre valores booleanos`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede realizar la suma entre un valor booleano (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.STRING);
                        return (leftOp ? 'true' : 'false') + rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp.charCodeAt(0).toString()) + parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) + parseFloat(rightOp);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede realizar la suma entre un caracter (${ leftOp }) y un valor booleano`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + rightOp;
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + rightOp.toString();
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + rightOp.toString();
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + (rightOp ? 'true' : 'false');
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + rightOp.toString();
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.STRING);
                        return leftOp + rightOp;
                    default:
                        return new Error('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede realizar la suma`, this.row, this.column);
        }
    }

    minus(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) - parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) - parseInt((rightOp ? 1 : 0).toString());
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) - parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede realizar la resta entre un entero (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat((rightOp ? 1 : 0).toString());
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede realizar la resta entre un doble (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt((leftOp ? 1 : 0).toString()) - parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat((leftOp ? 1 : 0).toString()) - parseFloat(rightOp);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede realizar la resta entre valores booleanos`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede realizar la resta entre un valor booleano (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede realizar la resta entre un valor booleano (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }   
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp.charCodeAt(0).toString()) - parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) - parseFloat(rightOp);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede realizar la resta entre un caracter (${ leftOp }) y un valor booleano`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede realizar la resta entre dos caracteres (${ leftOp }, ${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede realizar la resta entre un caracter (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar la resta entre una cadena (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar la resta entre una cadena (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la resta entre una cadena (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la resta entre una cadena (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la resta entre dos cadenas`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }     
            default:
                return new Error('Semantico', `No se puede realizar la resta`, this.row, this.column);
        }
    }

    times(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) * parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un entero (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) * parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un entero (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un doble (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un doble (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un booleano (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un booleano (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la multiplicación entre valores booleanos`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un booleano (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un booleano (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp.charCodeAt(0).toString()) * parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) * parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un caracter (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la multiplicación entre dos caracteres (${ leftOp }, ${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la multiplicación entre un caracter (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar la multiplicación entre una cadena (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar la multiplicación entre una cadena (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la multiplicación entre una cadena (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la multiplicación entre una cadena (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la multiplicación entre dos cadenas`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            default:
                new Error('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
        }
    }

    div(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) / parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) / parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la división entre un entero (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.INT);
                        return parseInt(leftOp) / parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la división entre un entero (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) / parseFloat(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) / parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la división entre un doble (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) / parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la división entre un doble (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) / parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) / parseFloat(rightOp);
                    default:
                        return new Error('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    default:
                        return new Error('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            default:
                new Error('Semantico', `No se puede realizar la división`, this.row, this.column);
        }
    }

    mod(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseInt(leftOp) % parseInt(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) % parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar el módulo entre un entero (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar el módulo entre un entero (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar el módulo entre un entero (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) % parseFloat(rightOp);
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return parseFloat(leftOp) % parseFloat(rightOp);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar el módulo entre un doble (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar el módulo entre un doble (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar el módulo entre un doble (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar el módulo entre un booleano (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar el módulo entre un booleano (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar el módulo entre valores booleanos`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar el módulo entre un booleano (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar el módulo entre un booleano (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar el módulo entre un caracter (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar el módulo entre un caracter (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar el módulo entre un caracter (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar el módulo entre dos caracteres`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar el módulo entre un caracter (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar el módulo entre una cadena (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar el módulo entre una cadena (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar el módulo entre una cadena (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar el módulo entre una cadena (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar el módulo entre dos cadenas`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            default:
                new Error('Semantico', `No se puede realizar el módulo`, this.row, this.column);
        }
    }

    power(leftOp: any, rightOp: any){
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.INT);
                        return Math.pow(parseInt(leftOp), parseInt(rightOp));
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return Math.pow(parseInt(leftOp), parseFloat(rightOp));
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la potencia entre un entero (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la potencia entre un entero (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la potencia entre un entero (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return Math.pow(parseFloat(leftOp), parseInt(rightOp));
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.FLOAT);
                        return Math.pow(parseFloat(leftOp), parseFloat(rightOp));
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la potencia entre un doble (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la potencia entre un doble (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la potencia entre un doble (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar la potencia entre un booleano (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar la potencia entre un booleano (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la potencia entre valores booleanos`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la potencia entre un booleano (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la potencia entre un booleano (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar la potencia entre un caracter (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar la potencia entre un caracter (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la potencia entre un caracter (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la potencia entre dos caracteres`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la potencia entre un caracter (${ leftOp }) y una cadena (${ rightOp })`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        new Error('Semantico', `No se puede realizar la potencia entre una cadena (${ leftOp }) y un entero (${ rightOp })`, this.row, this.column);
                    case typeData.FLOAT:
                        new Error('Semantico', `No se puede realizar la potencia entre una cadena (${ leftOp }) y un doble (${ rightOp })`, this.row, this.column);
                    case typeData.BOOL:
                        new Error('Semantico', `No se puede realizar la potencia entre una cadena (${ leftOp }) y un booleano (${ rightOp })`, this.row, this.column);
                    case typeData.CHAR:
                        new Error('Semantico', `No se puede realizar la potencia entre una cadena (${ leftOp }) y un caracter (${ rightOp })`, this.row, this.column);
                    case typeData.STRING:
                        new Error('Semantico', `No se puede realizar la potencia entre dos cadenas`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            default:
                new Error('Semantico', `No se puede realizar la potencia`, this.row, this.column);
        }
    }

    negative(operand: any) {
        let op = this.uniqueOperand?.typeData.getTypeData();
        switch (op) {
            case typeData.INT:
                this.typeData = new TypeD(typeData.INT);
                return -parseInt(operand);
            case typeData.FLOAT:
                this.typeData = new TypeD(typeData.FLOAT);
                return -parseFloat(operand);
            case typeData.BOOL:
                return new Error('Semantico', `No se puede realizar la negación de un valor booleano`, this.row, this.column);
            case typeData.CHAR:
                return new Error('Semantico', `No se puede realizar la negación de un caracter`, this.row, this.column);
            case typeData.STRING:
                return new Error('Semantico', `No se puede realizar la negación de una cadena`, this.row, this.column);
            default:
                return new Error('Semantico', `No se puede realizar la negación`, this.row, this.column);
        }
    }


    ast(fatherNode: string): string {
        // HEAD
        let newFather = `node_Arit${this.nameNode}`;
        let ast = `${newFather}[label="ARITHMETIC INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        
        if (this.uniqueOperand != null) {
            ast += `node_Arit_Sig${this.nameNode} [label="${this.getArithmetic(this.operator)}"]\n`
            ast += `nodeuniOp_Ari${this.nameNode} [label="${this.uniqueOperand}"]\n`

            ast += `${newFather} -> node_Arit_Sig${this.nameNode}\n`
            ast += `${newFather} -> nodeuniOp_Ari${this.nameNode}\n`
        } else {
            ast += `nodeLeft_Arit${this.nameNode} [label="valor1"]\n`
            ast += `node_Arit_Sig${this.nameNode} [label="${this.getArithmetic(this.operator)}"]\n`
            ast += `nodeRight_Arit${this.nameNode} [label="valor2"]\n`
            ast += `${newFather} -> nodeLeft_Arit${this.nameNode}\n`
            ast += `${newFather} -> node_Arit_Sig${this.nameNode}\n`
            ast += `${newFather} -> nodeRight_Arit${this.nameNode}\n`
            ast += this.leftOperand?.ast(`nodeLeft_Arit${this.nameNode}`);
            ast += this.rightOperand?.ast(`nodeRight_Arit${this.nameNode}`);

        }
        return ast
    }

    getArithmetic(arithmetic: ArithmeticOption) {
        switch (arithmetic) {
            case ArithmeticOption.PLUS:
                return '+';
            case ArithmeticOption.MINUS:
                return '-';
            case ArithmeticOption.TIMES:
                return '*';
            case ArithmeticOption.DIV:
                return '/';
            case ArithmeticOption.MOD:
                return '%';
            case ArithmeticOption.POWER:
                return '^';
            case ArithmeticOption.NEGATIVE:
                return '-';
        }
    }
}

export enum ArithmeticOption {
    PLUS,
    MINUS,
    TIMES,
    DIV,
    MOD,
    POWER,
    NEGATIVE,
}