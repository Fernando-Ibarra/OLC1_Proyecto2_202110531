"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Cout extends __1.Instruction {
    constructor(exp, line, column, endl) {
        super(new TypeD_1.default(__1.typeData.VOID), line, column);
        this.expression = exp;
        this.endl = endl;
    }
    interpret(tree, table) {
        let value = this.expression.interpret(tree, table);
        if (value instanceof __1.Error)
            return value;
        if (this.endl) {
            value += '\n';
            tree.Cout(value);
        }
        else {
            tree.Cout(value);
        }
    }
}
exports.default = Cout;
