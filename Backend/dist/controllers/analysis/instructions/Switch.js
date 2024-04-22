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
class Switch extends __1.Instruction {
    constructor(expression, row, column, cases, defaultCase) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.defaultVal = false;
        this.finished = false;
        this.expression = expression;
        this.cases = cases;
        this.default = defaultCase;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        var _a, _b;
        let expression = this.expression.interpret(tree, table);
        if (expression instanceof Errors_1.default)
            return expression;
        (_a = this.cases) === null || _a === void 0 ? void 0 : _a.forEach(caseInstruction => {
            let expressionCase = caseInstruction.expression.interpret(tree, table);
            if (expressionCase instanceof Errors_1.default)
                return expressionCase;
            if (expressionCase == expression) {
                let newTable = new __1.SymbolTable(table);
                newTable.setName("Case Statement");
                let result = caseInstruction.interpret(tree, newTable);
                if (result instanceof Errors_1.default)
                    return result;
                if (result instanceof Break_1.default) {
                    this.finished = true;
                    this.defaultVal = false;
                    return result;
                }
            }
            else {
                this.defaultVal = true;
                return;
            }
        });
        if (this.defaultVal && !this.finished) {
            let newTable = new __1.SymbolTable(table);
            newTable.setName("Default Statement");
            let result = (_b = this.default) === null || _b === void 0 ? void 0 : _b.interpret(tree, newTable);
            if (result instanceof Errors_1.default)
                return result;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Switch${this.nodeName}`;
        let ast = `${newFather}[label="SWITCH INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Switch${this.nodeName}_SWH [label="switch"]\n`;
        ast += `node_Switch${this.nodeName}_LP[label="("]\n`;
        ast += `node_Switch${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_Switch${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Switch${this.nodeName}_LB[label="{"]\n`;
        ast += `node_Switch${this.nodeName}_CASES_LIST  [label="CASES_LIST"]\n`;
        ast += `node_Switch${this.nodeName}_DEFAULT  [label="DEFAULT"]\n`;
        ast += `node_Switch${this.nodeName}_RB[label="}"]\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_SWH\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_CASES_LIST\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_DEFAULT\n`;
        ast += `${newFather} -> node_Switch${this.nodeName}_RB\n`;
        ast += this.expression.ast(`node_Switch${this.nodeName}_EXPRESION`);
        for (let i of this.cases || []) {
            ast += i.ast(`node_Switch${this.nodeName}_CASES_LIST`);
        }
        if (this.default) {
            ast += this.default.ast(`node_Switch${this.nodeName}_DEFAULT`);
        }
        return ast;
    }
}
exports.default = Switch;
