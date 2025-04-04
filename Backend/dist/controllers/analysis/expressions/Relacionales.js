"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalOption = void 0;
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
// TODO: Operaciones como cadena-carácter, es error semántico, a menos que se utilice toString en el carácter.
class Relacionales extends __1.Instruction {
    constructor(relational, row, column, leftOperand, rightOperand) {
        super(new TypeD_1.default(__1.typeData.BOOL), row, column);
        this.relational = relational;
        if (!rightOperand) {
            this.uniqueOperand = leftOperand;
        }
        else {
            this.leftOperand = leftOperand;
            this.rightOperand = rightOperand;
        }
        this.nameNode = `${row}_${column}`;
    }
    interpret(tree, table) {
        var _a, _b;
        let leftOp, rightOp, uniqueOp = null;
        if (this.uniqueOperand != null) {
            uniqueOp = this.uniqueOperand.interpret(tree, table);
            if (uniqueOp instanceof Errors_1.default)
                return uniqueOp;
        }
        else {
            leftOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.interpret(tree, table);
            if (leftOp instanceof Errors_1.default)
                return leftOp;
            rightOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.interpret(tree, table);
            if (rightOp instanceof Errors_1.default)
                return rightOp;
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
                return new Errors_1.default('Semantico', `Operador relacional invalido`, this.row, this.column);
        }
    }
    equals(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp) == parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseInt(leftOp) == parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseInt(leftOp) == parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseFloat(leftOp) == parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp) == parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseFloat(leftOp) == parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        return leftOp == rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) == parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) == parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp == rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.STRING:
                        return leftOp == rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
    different(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp) != parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseInt(leftOp) != parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseInt(leftOp) != parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseFloat(leftOp) != parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp) != parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp != parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        return leftOp != rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) != parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) != parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp != rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.STRING:
                        return leftOp != rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
    less(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp) < parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseInt(leftOp) < parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseInt(leftOp) < parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseFloat(leftOp) < parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp) < parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseFloat(leftOp) < parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        return leftOp < rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) < parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) < parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp < rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.STRING:
                        return leftOp < rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
    lessEqual(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp) <= parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseInt(leftOp) <= parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseInt(leftOp) <= parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseFloat(leftOp) <= parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp) <= parseInt(rightOp);
                    case __1.typeData.CHAR:
                        return parseFloat(leftOp) <= parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        return leftOp <= rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) <= parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) <= parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp <= rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.STRING:
                        return leftOp <= rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
    greater(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp) > parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseInt(leftOp) > parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseInt(leftOp) > parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseFloat(leftOp) > parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp) > parseFloat(rightOp);
                        ;
                    case __1.typeData.CHAR:
                        return parseFloat(leftOp) > parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        return leftOp > rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) > parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) > parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp > rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.STRING:
                        return leftOp > rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
    greaterEqual(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp) >= parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseInt(leftOp) >= parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp >= parseInt(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseFloat(leftOp) >= parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp) >= parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return parseFloat(leftOp) >= parseFloat(rightOp.charCodeAt(0).toString());
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación entre un booleano ${leftOp} y un entero ${rightOp}`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación entre un booleano ${leftOp} y un doble ${rightOp}`, this.row, this.column);
                    case __1.typeData.BOOL:
                        return leftOp >= rightOp;
                    case __1.typeData.CHAR:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación entre un booleano ${leftOp} y un caracter ${rightOp}`, this.row, this.column);
                    case __1.typeData.STRING:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación entre un booleano ${leftOp} y una cadena ${rightOp}`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        return parseInt(leftOp.charCodeAt(0).toString()) >= parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        return parseFloat(leftOp.charCodeAt(0).toString()) >= parseFloat(rightOp);
                    case __1.typeData.CHAR:
                        return leftOp >= rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.STRING:
                        return leftOp >= rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede relalizar la comparación`, this.row, this.column);
        }
    }
    ast(fatherNode) {
        var _a, _b;
        // HEAD
        let newFather = `node_Rela${this.nameNode}`;
        let ast = `${newFather}[label="RELACIONAL INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        if (this.uniqueOperand != null) {
            ast += `node_Rela_Sig${this.nameNode} [label="${this.getRelacional(this.relational)}"]\n`;
            ast += `nodeuniOp_Re${this.nameNode} [label="${this.uniqueOperand}"]\n`;
            ast += `${newFather} -> node_Rela_Sig${this.nameNode}\n`;
            ast += `${newFather} -> nodeuniOp_Re${this.nameNode}\n`;
        }
        else {
            ast += `nodeLeft_Re${this.nameNode} [label="valor1"]\n`;
            ast += `node_Rela_Sig${this.nameNode} [label="${this.getRelacional(this.relational)}"]\n`;
            ast += `nodeRight_Re${this.nameNode} [label="valor2"]\n`;
            ast += `${newFather} -> nodeLeft_Re${this.nameNode}\n`;
            ast += `${newFather} -> node_Rela_Sig${this.nameNode}\n`;
            ast += `${newFather} -> nodeRight_Re${this.nameNode}\n`;
            ast += (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.ast(`nodeLeft_Re${this.nameNode}`);
            ast += (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.ast(`nodeRight_Re${this.nameNode}`);
        }
        return ast;
    }
    getRelacional(relacional) {
        switch (relacional) {
            case RelationalOption.EQUALS:
                return '==';
            case RelationalOption.DIFFERENT:
                return '!=';
            case RelationalOption.LESS:
                return '<';
            case RelationalOption.LESS_EQUAL:
                return '<=';
            case RelationalOption.GREATER:
                return '>';
            case RelationalOption.GREATER_EQUAL:
                return '>=';
        }
    }
}
exports.default = Relacionales;
var RelationalOption;
(function (RelationalOption) {
    RelationalOption[RelationalOption["EQUALS"] = 0] = "EQUALS";
    RelationalOption[RelationalOption["DIFFERENT"] = 1] = "DIFFERENT";
    RelationalOption[RelationalOption["LESS"] = 2] = "LESS";
    RelationalOption[RelationalOption["LESS_EQUAL"] = 3] = "LESS_EQUAL";
    RelationalOption[RelationalOption["GREATER"] = 4] = "GREATER";
    RelationalOption[RelationalOption["GREATER_EQUAL"] = 5] = "GREATER_EQUAL";
})(RelationalOption || (exports.RelationalOption = RelationalOption = {}));
