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
        this.nodeName = `DoWhile${row}_${column}`;
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
        let ast = `${newFather}[label="Do While"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_DoWhile${this.nodeName}_1[label="Condition"]\n`;
        ast += `${newFather} -> node_DoWhile${this.nodeName}_1\n`;
        ast += this.condition.ast(`node_DoWhile${this.nodeName}_1`);
        for (let i of this.instructions) {
            ast += i.ast(newFather);
        }
        return ast;
    }
}
exports.default = DoWhile;
