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
const TypeD_1 = __importStar(require("../symbols/TypeD"));
const Break_1 = __importDefault(require("./Break"));
class Case extends __1.Instruction {
    constructor(expression, instructions, row, column) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.expression = expression;
        this.instructions = instructions;
        this.nodeName = `Case${row}_${column}`;
    }
    interpret(tree, table) {
        let newTable = new __1.SymbolTable(table);
        newTable.setName("Case Statement");
        let value = this.expression.interpret(tree, table);
        if (value instanceof __1.Error)
            return value;
        for (let i of this.instructions) {
            if (i instanceof __1.Error)
                return i;
            if (i instanceof Break_1.default)
                return i;
            let result = i.interpret(tree, newTable);
            if (result instanceof __1.Error)
                return result;
            if (result instanceof Break_1.default)
                return result;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Case${this.nodeName}`;
        let ast = `${newFather}[label="Case"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Case${this.nodeName}_1[label="Expression"]\n`;
        ast += `${newFather} -> node_Case${this.nodeName}_1\n`;
        ast += this.expression.ast(`node_Case${this.nodeName}_1`);
        for (let i of this.instructions) {
            ast += i.ast(newFather);
        }
        return ast;
    }
}
exports.default = Case;
