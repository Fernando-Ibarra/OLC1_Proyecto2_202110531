"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Round extends __1.Instruction {
    constructor(exp, line, column) {
        super(new TypeD_1.default(__1.typeData.STRING), line, column);
        this.expression = exp;
        this.nodeName = `Round${line}_${column}`;
    }
    interpret(tree, table) {
        let value = this.expression.interpret(tree, table);
        if (value instanceof Errors_1.default)
            return value;
        if (value == null)
            return new Errors_1.default('Semantico', `La variable ${value} no existe`, this.row, this.column);
        if (this.expression.typeData.getTypeData() != __1.typeData.FLOAT) {
            return new Errors_1.default('Semantico', `No se puede aplicar la función round tolower a ${this.expression.typeData.getTypeData()}`, this.row, this.column);
        }
        this.typeData = new TypeD_1.default(__1.typeData.FLOAT);
        return Math.round(value);
    }
    ast(fatherNode) {
        let ast = `node_${this.nodeName}[label="Round"]\n`;
        ast += `${fatherNode} -> node_${this.nodeName}\n`;
        ast += this.expression.ast(`node_${this.nodeName}`);
        return ast;
    }
}
exports.default = Round;
