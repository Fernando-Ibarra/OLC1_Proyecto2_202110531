"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArithmeticOption = void 0;
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Aritmeticas extends __1.Instruction {
    constructor(operator, row, column, leftOperand, rightOperand) {
        super(new TypeD_1.default(__1.typeData.INT), row, column);
        this.operator = operator;
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
                return new Errors_1.default('Semantico', `Operador aritmetico invalido`, this.row, this.column);
        }
    }
    plus(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) + parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) + parseInt((rightOp ? 1 : 0).toString());
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) + parseInt(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return parseInt(leftOp) + rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat((rightOp ? 1 : 0).toString());
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) + parseFloat(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return parseFloat(leftOp) + rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt((leftOp ? 1 : 0).toString()) + parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat((leftOp ? 1 : 0).toString()) + parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma entre valores booleanos`, this.row, this.column);
                    case __1.typeData.CHAR:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma entre un valor booleano (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return (leftOp ? 'true' : 'false') + rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp.charCodeAt(0).toString()) + parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) + parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma entre un caracter (${leftOp}) y un valor booleano`, this.row, this.column);
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + rightOp;
                    case __1.typeData.STRING:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + rightOp.toString();
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + rightOp.toString();
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + (rightOp ? 'true' : 'false');
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + rightOp.toString();
                    case __1.typeData.STRING:
                        this.typeData = new TypeD_1.default(__1.typeData.STRING);
                        return leftOp + rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la suma`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede realizar la suma`, this.row, this.column);
        }
    }
    minus(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) - parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) - parseInt((rightOp ? 1 : 0).toString());
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) - parseInt(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre un entero (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat((rightOp ? 1 : 0).toString());
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) - parseFloat(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre un doble (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt((leftOp ? 1 : 0).toString()) - parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat((leftOp ? 1 : 0).toString()) - parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre valores booleanos`, this.row, this.column);
                    case __1.typeData.CHAR:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre un valor booleano (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre un valor booleano (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp.charCodeAt(0).toString()) - parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) - parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre un caracter (${leftOp}) y un valor booleano`, this.row, this.column);
                    case __1.typeData.CHAR:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre dos caracteres (${leftOp}, ${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta entre un caracter (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar la resta entre una cadena (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar la resta entre una cadena (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la resta entre una cadena (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la resta entre una cadena (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la resta entre dos cadenas`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la resta`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede realizar la resta`, this.row, this.column);
        }
    }
    times(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) * parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un entero (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) * parseInt(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un entero (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un doble (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) * parseFloat(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un doble (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un booleano (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un booleano (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre valores booleanos`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un booleano (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un booleano (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp.charCodeAt(0).toString()) * parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) * parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un caracter (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre dos caracteres (${leftOp}, ${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre un caracter (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre una cadena (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre una cadena (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre una cadena (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre una cadena (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la multiplicación entre dos cadenas`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
                }
            default:
                new Errors_1.default('Semantico', `No se puede realizar la multiplicación`, this.row, this.column);
        }
    }
    div(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) / parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) / parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la división entre un entero (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return parseInt(leftOp) / parseInt(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la división entre un entero (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) / parseFloat(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) / parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la división entre un doble (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) / parseFloat(rightOp.charCodeAt(0).toString());
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la división entre un doble (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) / parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp.charCodeAt(0).toString()) / parseFloat(rightOp);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la división`, this.row, this.column);
                }
            default:
                new Errors_1.default('Semantico', `No se puede realizar la división`, this.row, this.column);
        }
    }
    mod(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseInt(leftOp) % parseInt(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) % parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un entero (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un entero (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un entero (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) % parseFloat(rightOp);
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return parseFloat(leftOp) % parseFloat(rightOp);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un doble (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un doble (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un doble (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un booleano (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un booleano (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre valores booleanos`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un booleano (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un booleano (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un caracter (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un caracter (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un caracter (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre dos caracteres`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre un caracter (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre una cadena (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre una cadena (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre una cadena (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre una cadena (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar el módulo entre dos cadenas`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar el módulo`, this.row, this.column);
                }
            default:
                new Errors_1.default('Semantico', `No se puede realizar el módulo`, this.row, this.column);
        }
    }
    power(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.INT);
                        return Math.pow(parseInt(leftOp), parseInt(rightOp));
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return Math.pow(parseInt(leftOp), parseFloat(rightOp));
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un entero (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un entero (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un entero (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    case __1.typeData.INT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return Math.pow(parseFloat(leftOp), parseInt(rightOp));
                    case __1.typeData.FLOAT:
                        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                        return Math.pow(parseFloat(leftOp), parseFloat(rightOp));
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un doble (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un doble (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un doble (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un booleano (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un booleano (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre valores booleanos`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un booleano (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un booleano (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un caracter (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un caracter (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un caracter (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre dos caracteres`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre un caracter (${leftOp}) y una cadena (${rightOp})`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    case __1.typeData.INT:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre una cadena (${leftOp}) y un entero (${rightOp})`, this.row, this.column);
                    case __1.typeData.FLOAT:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre una cadena (${leftOp}) y un doble (${rightOp})`, this.row, this.column);
                    case __1.typeData.BOOL:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre una cadena (${leftOp}) y un booleano (${rightOp})`, this.row, this.column);
                    case __1.typeData.CHAR:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre una cadena (${leftOp}) y un caracter (${rightOp})`, this.row, this.column);
                    case __1.typeData.STRING:
                        new Errors_1.default('Semantico', `No se puede realizar la potencia entre dos cadenas`, this.row, this.column);
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la potencia`, this.row, this.column);
                }
            default:
                new Errors_1.default('Semantico', `No se puede realizar la potencia`, this.row, this.column);
        }
    }
    negative(operand) {
        var _a;
        let op = (_a = this.uniqueOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        switch (op) {
            case __1.typeData.INT:
                this.typeData = new TypeD_1.default(__1.typeData.INT);
                return -parseInt(operand);
            case __1.typeData.FLOAT:
                this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
                return -parseFloat(operand);
            case __1.typeData.BOOL:
                return new Errors_1.default('Semantico', `No se puede realizar la negación de un valor booleano`, this.row, this.column);
            case __1.typeData.CHAR:
                return new Errors_1.default('Semantico', `No se puede realizar la negación de un caracter`, this.row, this.column);
            case __1.typeData.STRING:
                return new Errors_1.default('Semantico', `No se puede realizar la negación de una cadena`, this.row, this.column);
            default:
                return new Errors_1.default('Semantico', `No se puede realizar la negación`, this.row, this.column);
        }
    }
    ast(fatherNode) {
        var _a, _b;
        // HEAD
        let newFather = `node_Arit${this.nameNode}`;
        let ast = `${newFather}[label="ARITHMETIC INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        if (this.uniqueOperand != null) {
            ast += `node_Arit_Sig${this.nameNode} [label="${this.getArithmetic(this.operator)}"]\n`;
            ast += `nodeuniOp_Ari${this.nameNode} [label="${this.uniqueOperand}"]\n`;
            ast += `${newFather} -> node_Arit_Sig${this.nameNode}\n`;
            ast += `${newFather} -> nodeuniOp_Ari${this.nameNode}\n`;
        }
        else {
            ast += `nodeLeft_Arit${this.nameNode} [label="valor1"]\n`;
            ast += `node_Arit_Sig${this.nameNode} [label="${this.getArithmetic(this.operator)}"]\n`;
            ast += `nodeRight_Arit${this.nameNode} [label="valor2"]\n`;
            ast += `${newFather} -> nodeLeft_Arit${this.nameNode}\n`;
            ast += `${newFather} -> node_Arit_Sig${this.nameNode}\n`;
            ast += `${newFather} -> nodeRight_Arit${this.nameNode}\n`;
            ast += (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.ast(`nodeLeft_Arit${this.nameNode}`);
            ast += (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.ast(`nodeRight_Arit${this.nameNode}`);
        }
        return ast;
    }
    getArithmetic(arithmetic) {
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
exports.default = Aritmeticas;
var ArithmeticOption;
(function (ArithmeticOption) {
    ArithmeticOption[ArithmeticOption["PLUS"] = 0] = "PLUS";
    ArithmeticOption[ArithmeticOption["MINUS"] = 1] = "MINUS";
    ArithmeticOption[ArithmeticOption["TIMES"] = 2] = "TIMES";
    ArithmeticOption[ArithmeticOption["DIV"] = 3] = "DIV";
    ArithmeticOption[ArithmeticOption["MOD"] = 4] = "MOD";
    ArithmeticOption[ArithmeticOption["POWER"] = 5] = "POWER";
    ArithmeticOption[ArithmeticOption["NEGATIVE"] = 6] = "NEGATIVE";
})(ArithmeticOption || (exports.ArithmeticOption = ArithmeticOption = {}));
