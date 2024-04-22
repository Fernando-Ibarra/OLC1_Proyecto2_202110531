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
const Return_1 = __importDefault(require("./Return"));
const Continue_1 = __importDefault(require("./Continue"));
class If extends __1.Instruction {
    constructor(condition, instructions, row, column, instructionsElse) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.instructionsElse = instructionsElse;
        this.nameNode = `${row}_${column}`;
    }
    interpret(tree, table) {
        let cond = this.condition.interpret(tree, table);
        if (cond instanceof Errors_1.default)
            return cond;
        if (this.condition.typeData.getTypeData() != TypeD_1.typeData.BOOL) {
            return new Errors_1.default("Semántico", "Se esperaba una expresión booleana en la condición del if", this.row, this.column);
        }
        if (cond) {
            let newTable = new __1.SymbolTable(table);
            newTable.setName("If Statement");
            for (let i of this.instructions) {
                if (i instanceof Break_1.default)
                    return i;
                if (i instanceof Return_1.default) {
                    return i;
                }
                ;
                if (i instanceof Continue_1.default)
                    return i;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break_1.default)
                    return result;
                if (result instanceof Return_1.default) {
                    return result;
                }
                ;
                if (result instanceof Continue_1.default)
                    return result;
                if (result instanceof Errors_1.default)
                    return result;
            }
        }
        else {
            if (Array.isArray(this.instructionsElse)) {
                let newTableElse = new __1.SymbolTable(table);
                newTableElse.setName("else Statement");
                for (let i of this.instructionsElse) {
                    if (i instanceof Break_1.default)
                        return i;
                    if (i instanceof Continue_1.default)
                        return i;
                    if (i instanceof Return_1.default)
                        return i;
                    let result = i.interpret(tree, newTableElse);
                    if (result instanceof Break_1.default)
                        return result;
                    if (result instanceof Return_1.default)
                        return result;
                    if (result instanceof Continue_1.default)
                        return result;
                    if (result instanceof Errors_1.default)
                        return result;
                }
            }
            else {
                if (this.instructionsElse instanceof If) {
                    let newTableElse = new __1.SymbolTable(table);
                    newTableElse.setName("else if Statement");
                    let result = this.instructionsElse.interpret(tree, newTableElse);
                }
            }
        }
    }
    ast(fatherNode) {
        // HEAD
        let newFather = `node_If${this.nameNode}`;
        let ast = `${newFather}[label="IF INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        // IF - CONDITION
        ast += `node_If${this.nameNode}_IF [label="if"]\n`;
        ast += `node_If${this.nameNode}_LP[label="("]\n`;
        ast += `node_If${this.nameNode}_EXPRESION [label="EXPRESION"]\n`;
        ast += `node_If${this.nameNode}_RP[label=")"]\n`;
        ast += `node_If${this.nameNode}_LB[label="{"]\n`;
        ast += `node_If${this.nameNode}_INSTRUCTIONS_IF [label="INSTRUCTIONS"]\n`;
        ast += `node_If${this.nameNode}_RB[label="}"]\n`;
        ast += `${newFather} -> node_If${this.nameNode}_IF\n`;
        ast += `${newFather} -> node_If${this.nameNode}_LP\n`;
        ast += `${newFather} -> node_If${this.nameNode}_EXPRESION\n`;
        ast += `${newFather} -> node_If${this.nameNode}_RP\n`;
        ast += `${newFather} -> node_If${this.nameNode}_LB\n`;
        ast += `${newFather} -> node_If${this.nameNode}_INSTRUCTIONS_IF\n`;
        ast += `${newFather} -> node_If${this.nameNode}_RB\n`;
        ast += this.condition.ast(`node_If${this.nameNode}_EXPRESION`);
        for (let i of this.instructions) {
            ast += i.ast(`node_If${this.nameNode}_INSTRUCTIONS_IF`);
        }
        // ELSE IF && ELSE
        if (this.instructionsElse) {
            ast += `node_If${this.nameNode}_ELSE [label="ELSE"]\n`;
            if (!Array.isArray(this.instructionsElse)) {
                // ELSE IF
                ast += `${newFather} -> node_If${this.nameNode}_ELSE\n`;
                ast += this.instructionsElse.ast(newFather);
            }
            else {
                // ELSE
                ast += `${newFather} -> node_If${this.nameNode}_ELSE\n`;
                ast += `node_If${this.nameNode}_LB_ELSE [label="{"]\n`;
                ast += `node_If${this.nameNode}_INSTRUCTIONS_ELSE [label="INSTRUCTIONS"]\n`;
                ast += `node_If${this.nameNode}_RB_ELSE [label="}"]\n`;
                ast += `${newFather} -> node_If${this.nameNode}_LB_ELSE\n`;
                ast += `${newFather} -> node_If${this.nameNode}_INSTRUCTIONS_ELSE\n`;
                ast += `${newFather} -> node_If${this.nameNode}_RB_ELSE\n`;
                for (let i of this.instructionsElse) {
                    ast += i.ast(`node_If${this.nameNode}_INSTRUCTIONS_ELSE`);
                }
            }
        }
        return ast;
    }
}
exports.default = If;
