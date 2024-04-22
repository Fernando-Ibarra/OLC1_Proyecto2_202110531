"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Cout extends __1.Instruction {
    constructor(exp, line, column, endl) {
        super(new TypeD_1.default(__1.typeData.VOID), line, column);
        this.expression = exp;
        this.endl = endl;
        this.nameNode = `${line}_${column}`;
    }
    interpret(tree, table) {
        let value = this.expression.interpret(tree, table);
        if (value instanceof Errors_1.default)
            return value;
        if (this.endl) {
            value += '\n';
            tree.Cout(value);
        }
        else {
            tree.Cout(value);
        }
    }
    ast(fatherNode) {
        let newFather = `node_Cout${this.nameNode}`;
        let ast = `${newFather}[label="COUT INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Cout${this.nameNode}_COUT [label="COUT"]\n`;
        ast += `node_Cout${this.nameNode}_LP[label="("]\n`;
        ast += `node_Cout${this.nameNode}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_Cout${this.nameNode}_RP[label=")"]\n`;
        ast += `node_Cout${this.nameNode}_SC [label=";"]\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_COUT\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_LP\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_EXPRESION\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_RP\n`;
        ast += `${newFather} -> node_Cout${this.nameNode}_SC\n`;
        ast += this.expression.ast(`node_Cout${this.nameNode}_EXPRESION`);
        return ast;
    }
}
exports.default = Cout;
