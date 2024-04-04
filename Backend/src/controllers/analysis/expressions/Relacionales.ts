import { SymbolTable, Tree, Instruction, Error, typeData } from '../';
import TypeD from '../symbols/TypeD';

// TODO: Operaciones como cadena-carácter, es error semántico, a menos que se utilice toString en el carácter.

export default class Relacionales extends Instruction {
    private leftOperand: Instruction | undefined;
    private rightOperand: Instruction | undefined;
    private relational: RelationalOption;
    private uniqueOperand: Instruction | undefined;

    constructor(relational: RelationalOption, row: number, column: number, leftOperand: Instruction, rightOperand?: Instruction) {
        super(new TypeD(typeData.INT), row, column);
        this.relational = relational;
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

        switch (this.relational) {
            case RelationalOption.EQUALS:
                return this.equals(leftOp, rightOp);
            case RelationalOption.DIFFERENT:
                return this.different(leftOp, rightOp);
            case RelationalOption.LESS:
                return this.less(leftOp, rightOp);
            case RelationalOption.LESS_EQUAL:
                return this.lessEqual(leftOp, rightOp);
            case RelationalOption.GREATER:
                return this.greater(leftOp, rightOp);
            case RelationalOption.GREATER_EQUAL:
                return this.greaterEqual(leftOp, rightOp);
            default:
                return new Error('Semantico', `Operador relacional invalido`, this.row, this.column);
        }
    }

    equals(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        return leftOp == rightOp;
                    case typeData.FLOAT:
                        return leftOp == rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp == parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp == rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp == rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return leftOp == parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp == rightOp;
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseInt(leftOp.charCodeAt(0).toString()) == rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseFloat(leftOp.charCodeAt(0).toString()) == rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp == rightOp;
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp == rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }

    different(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != rightOp;
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseInt(leftOp.charCodeAt(0).toString()) != rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseFloat(leftOp.charCodeAt(0).toString()) != rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return leftOp != rightOp;
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp != rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                    return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }

    less(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return leftOp < rightOp;
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseInt(leftOp.charCodeAt(0).toString()) < rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseFloat(leftOp.charCodeAt(0).toString()) < rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < rightOp;
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp < rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                    return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }

    lessEqual(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseInt(leftOp.charCodeAt(0).toString()) <= rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseFloat(leftOp.charCodeAt(0).toString()) <= rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp <= rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                    return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }

    greater(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseInt(leftOp.charCodeAt(0).toString()) > rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseFloat(leftOp.charCodeAt(0).toString()) > rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp > rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }

    greaterEqual(leftOp: any, rightOp: any) {
        let firstOp = this.leftOperand?.typeData.getTypeData();
        let secondOp = this.rightOperand?.typeData.getTypeData();
        switch (firstOp) {
            case typeData.INT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= parseInt(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor entero ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= parseFloat(rightOp.charCodeAt(0).toString());
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un valor doble ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un booleano ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseInt(leftOp.charCodeAt(0).toString()) >= rightOp;
                    case typeData.FLOAT:
                        this.typeData = new TypeD(typeData.BOOL);
                        return parseFloat(leftOp.charCodeAt(0).toString()) >= rightOp;
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    case typeData.STRING:
                        return new Error('Semantico', `No se puede relalizar la comparación entre un caracter ${ leftOp } y una cadena ${ rightOp }`, this.row, this.column);
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.INT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un entero ${ rightOp }`, this.row, this.column);
                    case typeData.FLOAT:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un doble ${ rightOp }`, this.row, this.column);
                    case typeData.BOOL:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un booleano ${ rightOp }`, this.row, this.column);
                    case typeData.CHAR:
                        return new Error('Semantico', `No se puede relalizar la comparación entre una cadena ${ leftOp } y un caracter ${ rightOp }`, this.row, this.column);
                    case typeData.STRING:
                        this.typeData = new TypeD(typeData.BOOL);
                        return leftOp >= rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
}

export enum RelationalOption {
    EQUALS,
    DIFFERENT,
    LESS,
    LESS_EQUAL,
    GREATER,
    GREATER_EQUAL
}