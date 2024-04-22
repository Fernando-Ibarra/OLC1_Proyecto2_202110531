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
class Ternary extends __1.Instruction {
    constructor(condition, conditionTrue, conditionFalse, row, column) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.condition = condition;
        this.conditionTrue = conditionTrue;
        this.conditionFalse = conditionFalse;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        let cond = this.condition.interpret(tree, table);
        if (cond instanceof Errors_1.default)
            return cond;
        if (this.condition.typeData.getTypeData() != TypeD_1.typeData.BOOL) {
            return new Errors_1.default("Semántico", "Se esperaba una expresión booleana en la condición del ternario", this.row, this.column);
        }
        if (cond) {
            this.typeData = this.conditionTrue.typeData;
            let value = this.conditionTrue.interpret(tree, table);
            if (value instanceof Errors_1.default)
                return value;
            return value;
        }
        else {
            this.typeData = this.conditionFalse.typeData;
            let value = this.conditionFalse.interpret(tree, table);
            if (value instanceof Errors_1.default)
                return value;
            return value;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Ternary${this.nodeName}`;
        let ast = `${newFather}[label="TERNARY INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Ternary${this.nodeName}_LP[label="("]\n`;
        ast += `node_Ternary${this.nodeName}_CONDITION [label="CONDITION"]\n`;
        ast += `node_Ternary${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Ternary${this.nodeName}_IN[label="?"]\n`;
        ast += `node_Ternary${this.nodeName}_EXPRESION1 [label="EXPRESION"]\n`;
        ast += `node_Ternary${this.nodeName}_CL [label=":"]\n`;
        ast += `node_Ternary${this.nodeName}_EXPRESION2 [label="EXPRESION"]\n`;
        ast += `node_Ternary${this.nodeName}_SC [label=";"]\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_CONDITION\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_IN\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_EXPRESION1\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_CL\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_EXPRESION2\n`;
        ast += `${newFather} -> node_Ternary${this.nodeName}_SC\n`;
        ast += this.condition.ast(`node_Ternary${this.nodeName}_CONDITION`);
        ast += this.conditionTrue.ast(`node_Ternary${this.nodeName}_EXPRESION1`);
        ast += this.conditionFalse.ast(`node_Ternary${this.nodeName}_EXPRESION2`);
        return ast;
    }
}
exports.default = Ternary;
