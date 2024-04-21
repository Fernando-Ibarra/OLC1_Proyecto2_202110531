"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const Return_1 = __importDefault(require("./Return"));
class Functions extends __1.Instruction {
    constructor(id, tipoV, instructions, row, column, params) {
        super(tipoV, row, column);
        this.id = id[0];
        this.params = params;
        this.instructions = instructions;
    }
    interpret(tree, table) {
        for (let i of this.instructions) {
            console.log("FUNCTIONS: ", i);
            if (i instanceof Return_1.default) {
                console.log("FUNCTION - IF", i);
                return i;
            }
            let result = i.interpret(tree, table);
            if (result instanceof Errors_1.default)
                return result;
            if (result instanceof Return_1.default) {
                console.log("FUNCTION - RESULT - IF", result);
                let resultCall = result.interpret(tree, table);
                return resultCall;
            }
            ;
        }
    }
    ast(fatherNode) {
        let ast = `node_${this.row}_${this.column}[label="Function"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}\n`;
        ast += `node_${this.row}_${this.column}_1[label="id: ${this.id}"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}_1\n`;
        ast += `node_${this.row}_${this.column}_2[label="params"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}_2\n`;
        // for(let i of this.params) {
        //     ast += i.ast(`node_${this.row}_${this.column}_2`)
        // }
        ast += `node_${this.row}_${this.column}_3[label="instructions"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}_3\n`;
        for (let i of this.instructions) {
            ast += i.ast(`node_${this.row}_${this.column}_3`);
        }
        return ast;
    }
}
exports.default = Functions;
