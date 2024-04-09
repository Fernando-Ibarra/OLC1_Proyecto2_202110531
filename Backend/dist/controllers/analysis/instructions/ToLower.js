"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class ToLower extends __1.Instruction {
    constructor(exp, line, column) {
        super(new TypeD_1.default(__1.typeData.STRING), line, column);
        this.expression = exp;
    }
    interpret(tree, table) {
        let value = this.expression.interpret(tree, table);
        if (value instanceof __1.Error)
            return value;
        if (value == null)
            return new __1.Error('Semantico', `La variable ${value} no existe`, this.row, this.column);
        if (this.expression.typeData.getTypeData() != __1.typeData.STRING) {
            return new __1.Error('Semantico', `No se puede aplicar la función tolower a ${this.expression.typeData.getTypeData()}`, this.row, this.column);
        }
        this.typeData = new TypeD_1.default(__1.typeData.STRING);
        return value.toLocaleLowerCase();
    }
}
exports.default = ToLower;
