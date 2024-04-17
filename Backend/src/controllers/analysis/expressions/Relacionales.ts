import { SymbolTable, Tree, Instruction, typeData } from '../';
import Error from '../exceptions/Errors';
import TypeD from '../symbols/TypeD';
import { parse } from 'path';

// TODO: Operaciones como cadena-carácter, es error semántico, a menos que se utilice toString en el carácter.

export default class Relacionales extends Instruction {
    private leftOperand: Instruction | undefined;
    private rightOperand: Instruction | undefined;
    private relational: RelationalOption;
    private uniqueOperand: Instruction | undefined;
    private nameNode: string;

    constructor(relational: RelationalOption, row: number, column: number, leftOperand: Instruction, rightOperand?: Instruction) {
        super(new TypeD(typeData.BOOL), row, column);
        this.relational = relational;
        if (!rightOperand) {
            this.uniqueOperand = leftOperand;
        } else {
            this.leftOperand = leftOperand;
            this.rightOperand = rightOperand;
        }
        this.nameNode = `Relacionales${row}_${column}`;
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
                        return parseInt(leftOp) == parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseInt(leftOp) == parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseInt(leftOp) == parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        return parseFloat(leftOp) == parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp) == parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseFloat(leftOp) == parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                   case typeData.BOOL:
                        return leftOp == rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) == parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) == parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp == rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.STRING:
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
                        return parseInt(leftOp) != parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseInt(leftOp) != parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseInt(leftOp) != parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        return parseFloat(leftOp) != parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp) != parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp != parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.BOOL:
                        return leftOp != rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) != parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) != parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp != rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.STRING:
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
                        return parseInt(leftOp) < parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseInt(leftOp) < parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseInt(leftOp) < parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        return  parseFloat(leftOp) < parseInt(rightOp);
                    case typeData.FLOAT:
                        return  parseFloat(leftOp) < parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseFloat(leftOp) < parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.BOOL:
                        return leftOp < rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) < parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) < parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp < rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.STRING:
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
                        return parseInt(leftOp) <= parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseInt(leftOp) <= parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseInt(leftOp) <= parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        return parseFloat(leftOp) <= parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp) <= parseInt(rightOp);
                    case typeData.CHAR:
                        return parseFloat(leftOp) <= parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.BOOL:
                        return leftOp <= rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) <= parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) <= parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp <= rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.STRING:
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
                        return parseInt(leftOp) > parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseInt(leftOp) > parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseInt(leftOp) > parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        return parseFloat(leftOp) > parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp) > parseFloat(rightOp);;
                    case typeData.CHAR:
                        return parseFloat(leftOp) > parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.BOOL:
                switch (secondOp) {
                    case typeData.BOOL:
                        return leftOp > rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.CHAR:
                switch (secondOp) {
                    case typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) > parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) > parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp > rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.STRING:
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
                        return parseInt(leftOp) >= parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseInt(leftOp) >= parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp >= parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.FLOAT:
                switch (secondOp) {
                    case typeData.INT:
                        return parseFloat(leftOp) >= parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp) >= parseFloat(rightOp);
                    case typeData.CHAR:
                        return parseFloat(leftOp) >= parseFloat(rightOp.charCodeAt(0).toString());
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
                        return parseInt(leftOp.charCodeAt(0).toString()) >= parseInt(rightOp);
                    case typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) >= parseFloat(rightOp);
                    case typeData.CHAR:
                        return leftOp >= rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case typeData.STRING:
                switch (secondOp) {
                    case typeData.STRING:
                        return leftOp >= rightOp;
                    default:
                        return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Error('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }

    ast(fatherNode: string): string {
        let ast = '';
        
        if (!this.uniqueOperand) {
            ast += `node_Rela${this.nameNode} [label="${this.relational}"]\n`
            ast += `nodeuniOp${this.nameNode} [label="${this.uniqueOperand}"]\n`

            ast += `${fatherNode} -> node_Rela${this.nameNode}\n`
            ast += `${fatherNode} -> nodeuniOp${this.nameNode}\n`
        } else {
            ast += `nodeLeft${this.nameNode} [label="${this.leftOperand}"]\n`
            ast += `node_Rela${this.nameNode} [label="${this.relational}"]\n`
            ast += `nodeRight${this.nameNode} [label="${this.rightOperand}"]\n`
            ast += `${fatherNode} -> nodeLeft${this.nameNode}\n`
            ast += `${fatherNode} -> node_Rela${this.nameNode}\n`
            ast += `${fatherNode} -> nodeRight${this.nameNode}\n`
        }
        return ast
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