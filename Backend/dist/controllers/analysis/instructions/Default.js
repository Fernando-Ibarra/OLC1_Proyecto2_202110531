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
class Default extends __1.Instruction {
    constructor(instructions, row, column) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        let newTable = new __1.SymbolTable(table);
        newTable.setName("Default Statement");
        for (let i of this.instructions) {
            if (i instanceof Errors_1.default)
                return i;
            let result = i.interpret(tree, newTable);
            if (result instanceof Errors_1.default)
                return result;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Default${this.nodeName}`;
        let ast = `${newFather}[label="DEFAULT INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Default${this.nodeName}_DF [label="default"]\n`;
        ast += `node_Default${this.nodeName}_SC[label=":"]\n`;
        ast += `node_Default${this.nodeName}_INSTRUCTIONS [label="INSTRUCTIONS"]\n`;
        ast += `${newFather} -> node_Default${this.nodeName}_DF\n`;
        ast += `${newFather} -> node_Default${this.nodeName}_SC\n`;
        ast += `${newFather} -> node_Default${this.nodeName}_INSTRUCTIONS\n`;
        for (let i of this.instructions) {
            ast += i.ast(`node_Default${this.nodeName}_INSTRUCTIONS`);
        }
        return ast;
    }
}
exports.default = Default;
