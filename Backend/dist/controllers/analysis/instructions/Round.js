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
        this.nodeName = `${line}_${column}`;
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
        // HEAD
        let newFather = `node_Round${this.nodeName}`;
        let ast = `${newFather}[label="ROUND INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        // BODY
        ast += `node_Round${this.nodeName}_RD [label="round"]\n`;
        ast += `node_Round${this.nodeName}_LP [label="("]\n`;
        ast += `node_Round${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_Round${this.nodeName}_RP [label=")"]\n`;
        ast += `node_Round${this.nodeName}_SC [label=";"]\n`;
        ast += `${newFather} -> node_Round${this.nodeName}_RD\n`;
        ast += `${newFather} -> node_Round${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Round${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_Round${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Round${this.nodeName}_SC\n`;
        // EXPRESSION
        ast += this.expression.ast(`node_Round${this.nodeName}_EXPRESION`);
        return ast;
    }
}
exports.default = Round;
