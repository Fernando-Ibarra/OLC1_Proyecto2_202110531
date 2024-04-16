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
        this.nameNode = `Cout${line}_${column}`;
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
    ast(father) {
        let ast = `node_Cout${this.nameNode}[label="cout"]\n`;
        ast += `node_CoutLP${this.nameNode} [label="("]\n`;
        ast += this.expression.ast(`node_Cout${this.nameNode}`);
        ast += `node_CoutRP${this.nameNode} [label=")"]\n`;
        ast += `node_Cout${this.nameNode} -> node_CoutLP${this.nameNode}\n`;
        ast += `node_Cout${this.nameNode} -> node_CoutRP${this.nameNode} \n`;
        ast += `${father} -> node_Cout${this.nameNode} \n`;
        return ast;
    }
}
exports.default = Cout;
