"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicasOption = void 0;
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Logicas extends __1.Instruction {
    constructor(Logica, row, column, leftOperand, rightOperand) {
        super(new TypeD_1.default(__1.typeData.INT), row, column);
        this.Logica = Logica;
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
        switch (this.Logica) {
            case LogicasOption.AND:
                return this.and(leftOp, rightOp);
            case LogicasOption.OR:
                return this.or(leftOp, rightOp);
            case LogicasOption.NOT:
                return this.not(uniqueOp);
            default:
                return new Errors_1.default('Semantico', `Operador lógico invalido`, this.row, this.column);
        }
    }
    or(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.BOOL);
                        return leftOp || rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación OR entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede realizar la operacion OR`, this.row, this.column);
        }
    }
    and(leftOp, rightOp) {
        var _a, _b;
        let firstOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        let secondOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.INT:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.FLOAT:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.STRING:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.BOOL:
                switch (secondOp) {
                    case __1.typeData.BOOL:
                        this.typeData = new TypeD_1.default(__1.typeData.BOOL);
                        return leftOp && rightOp;
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            case __1.typeData.CHAR:
                switch (secondOp) {
                    default:
                        return new Errors_1.default('Semantico', `No se puede realizar la operación AND entre ${firstOp} y ${secondOp}`, this.row, this.column);
                }
            default:
                return new Errors_1.default('Semantico', `No se puede realizar la operacion AND`, this.row, this.column);
        }
    }
    not(operand) {
        var _a;
        let firstOp = (_a = this.uniqueOperand) === null || _a === void 0 ? void 0 : _a.typeData.getTypeData();
        switch (firstOp) {
            case __1.typeData.BOOL:
                this.typeData = new TypeD_1.default(__1.typeData.BOOL);
                return !operand;
            default:
                return new Errors_1.default('Semantico', `No se puede realizar la operación NOT con ${firstOp}`, this.row, this.column);
        }
    }
    ast(fatherNode) {
        var _a, _b;
        // HEAD
        let newFather = `node_Logicas${this.nameNode}`;
        let ast = `${newFather}[label="LOGICA INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        if (this.uniqueOperand != null) {
            ast += `node_Rela_Lo${this.nameNode} [label="${this.getLogica(this.Logica)}"]\n`;
            ast += `nodeuniOp_Lo${this.nameNode} [label="${this.uniqueOperand}"]\n`;
            ast += `${newFather} -> node_Rela_Lo${this.nameNode}\n`;
            ast += `${newFather} -> nodeuniOp_Lo${this.nameNode}\n`;
        }
        else {
            ast += `nodeLeft_Lo${this.nameNode} [label="valor1"]\n`;
            ast += `node_Rela_Lo${this.nameNode} [label="${this.getLogica(this.Logica)}"]\n`;
            ast += `nodeRight_Lo${this.nameNode} [label="valor2"]\n`;
            ast += `${newFather} -> nodeLeft_Lo${this.nameNode}\n`;
            ast += `${newFather} -> node_Rela_Lo${this.nameNode}\n`;
            ast += `${newFather} -> nodeRight_Lo${this.nameNode}\n`;
            ast += (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.ast(`nodeLeft_Lo${this.nameNode}`);
            ast += (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.ast(`nodeRight_Lo${this.nameNode}`);
        }
        return ast;
    }
    getLogica(loOpt) {
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
exports.default = Logicas;
var LogicasOption;
(function (LogicasOption) {
    LogicasOption[LogicasOption["OR"] = 0] = "OR";
    LogicasOption[LogicasOption["AND"] = 1] = "AND";
    LogicasOption[LogicasOption["NOT"] = 2] = "NOT";
})(LogicasOption || (exports.LogicasOption = LogicasOption = {}));
