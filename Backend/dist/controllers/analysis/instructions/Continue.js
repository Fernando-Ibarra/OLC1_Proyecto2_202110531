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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const TypeD_1 = __importStar(require("../symbols/TypeD"));
class Continue extends __1.Instruction {
    constructor(row, column) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        return;
    }
    ast(fatherNode) {
        let newFather = `node_Continue${this.nodeName}`;
        let ast = `${newFather}[label="Continue"]\n`;
        ast += `${fatherNode} -> node_Continue${this.nodeName}\n`;
        ast += `node_Continue${this.nodeName}_SC [label=";"]\n`;
        ast += `${fatherNode} -> node_Continue${this.nodeName}_SC\n`;
        return ast;
    }
}
exports.default = Continue;
