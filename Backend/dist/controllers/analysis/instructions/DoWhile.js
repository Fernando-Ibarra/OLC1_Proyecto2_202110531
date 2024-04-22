"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importStar(require("../symbols/TypeD"));
const Break_1 = __importDefault(require("./Break"));
const Continue_1 = __importDefault(require("./Continue"));
const Return_1 = __importDefault(require("./Return"));
class DoWhile extends __1.Instruction {
    constructor(condition, instructions, row, column) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        do {
            let newTable = new __1.SymbolTable(table);
            for (let i of this.instructions) {
                if (i instanceof Break_1.default)
                    return;
                if (i instanceof Continue_1.default)
                    continue;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break_1.default) {
                    return;
                }
                if (result instanceof Continue_1.default) {
                    continue;
                }
                if (result instanceof Return_1.default) {
                    return result;
                }
                if (result instanceof Errors_1.default) {
                    return;
                }
            }
        } while (this.condition.interpret(tree, table));
    }
    ast(fatherNode) {
        let newFather = `node_DoWhile${this.nodeName}`;
        let ast = `${newFather}[label="DO WHILE INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_DoWhile${this.nodeName}_DO [label="do"]\n`;
        ast += `node_DoWhile${this.nodeName}_LB[label="{"]\n`;
        ast += `node_DoWhile${this.nodeName}_INSTRUCTIONS_DW [label="INSTRUCTIONS"]\n`;
        ast += `node_DoWhile${this.nodeName}_RB[label="}"]\n`;
        ast += `node_DoWhile${this.nodeName}_WH [label="while"]\n`;
        ast += `node_DoWhile${this.nodeName}_LP[label="("]\n`;
        ast += `node_DoWhile${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_DoWhile${this.nodeName}_RP[label=")"]\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_DO\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_INSTRUCTIONS_DW\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_RB\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_WH\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_RP\n`;
        ast += this.condition.ast(`node_DoWhile${this.nodeName}_EXPRESION`);
        for (let i of this.instructions) {
            ast += i.ast(`node_DoWhile${this.nodeName}_INSTRUCTIONS_DW`);
        }
        return ast;
    }
}
exports.default = DoWhile;
