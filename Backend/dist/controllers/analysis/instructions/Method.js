"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const Return_1 = __importDefault(require("./Return"));
class Method extends __1.Instruction {
    constructor(id, tipoV, instructions, row, column, params) {
        super(tipoV, row, column);
        this.id = id[0];
        this.params = params;
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        for (let i of this.instructions) {
            let result = i.interpret(tree, table);
            if (result instanceof Errors_1.default)
                return result;
            if (result instanceof Return_1.default)
                break;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Method${this.nodeName}`;
        let ast = `${newFather}[label="METHOD INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Method${this.nodeName}_MT [label="VOID"]\n`;
        ast += `node_Method${this.nodeName}_ID[label="ID"]\n`;
        ast += `node_Method${this.nodeName}_LP[label="("]\n`;
        ast += `node_Method${this.nodeName}_PARM[label="PARAMS"]\n`;
        ast += `node_Method${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Method${this.nodeName}_LB[label="{"]\n`;
        ast += `node_Method${this.nodeName}_INSTRUCTIONS [label="INSTRUCTIONS"]\n`;
        ast += `node_Method${this.nodeName}_RB[label="}"]\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_MT\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_PARM\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_INSTRUCTIONS\n`;
        ast += `${newFather} -> node_Method${this.nodeName}_RB\n`;
        ast += `node_Method${this.nodeName}_ID_NAME [label="${this.id}"]\n`;
        ast += `node_Method${this.nodeName}_ID -> node_Method${this.nodeName}_ID_NAME\n`;
        for (let i of this.instructions) {
            ast += i.ast(`node_Method${this.nodeName}_INSTRUCTIONS`);
        }
        return ast;
    }
}
exports.default = Method;
