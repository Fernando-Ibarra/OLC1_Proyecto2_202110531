"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicasOption = void 0;
const __1 = require("../");
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
    }
    interpret(tree, table) {
        var _a, _b;
        let leftOp, rightOp, uniqueOp = null;
        if (this.uniqueOperand != null) {
            uniqueOp = this.uniqueOperand.interpret(tree, table);
            if (uniqueOp instanceof __1.Error)
                return uniqueOp;
        }
        else {
            leftOp = (_a = this.leftOperand) === null || _a === void 0 ? void 0 : _a.interpret(tree, table);
            if (leftOp instanceof __1.Error)
                return leftOp;
            rightOp = (_b = this.rightOperand) === null || _b === void 0 ? void 0 : _b.interpret(tree, table);
            if (rightOp instanceof __1.Error)
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
                return new __1.Error('Semantico', `Operador lógico invalido`, this.row, this.column);
        }
    }
    or(leftOp, rightOp) { }
    and(leftOp, rightOp) { }
    not(operand) { }
}
exports.default = Logicas;
var LogicasOption;
(function (LogicasOption) {
    LogicasOption[LogicasOption["OR"] = 0] = "OR";
    LogicasOption[LogicasOption["AND"] = 1] = "AND";
    LogicasOption[LogicasOption["NOT"] = 2] = "NOT";
})(LogicasOption || (exports.LogicasOption = LogicasOption = {}));
