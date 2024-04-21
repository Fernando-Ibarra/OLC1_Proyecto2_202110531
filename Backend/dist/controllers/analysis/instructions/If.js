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
    constructor(condition, instructions, row, column, elseIf = false, instructionsElse) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.condition = condition;
        this.instructions = instructions;
        this.instructionsElse = instructionsElse;
        this.elseIf = elseIf;
        this.nodeName = `If${row}_${column}`;
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
                    console.log("RETURN - IF", i);
                    return i;
                }
                ;
                if (i instanceof Continue_1.default)
                    return i;
                let result = i.interpret(tree, newTable);
                if (result instanceof Break_1.default)
                    return result;
                if (result instanceof Return_1.default) {
                    console.log("RETURN - RESULT - IF", result);
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
            if (this.elseIf) {
                let newTableElse = new __1.SymbolTable(table);
                newTableElse.setName("else Statement");
                if (Array.isArray(this.instructionsElse)) {
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
                    if (this.instructionsElse != undefined) {
                        let newTableElse = new __1.SymbolTable(table);
                        newTableElse.setName("else if Statement");
                        let result = this.instructionsElse.interpret(tree, newTableElse);
                    }
                }
            }
        }
    }
    ast(fatherNode) {
        let newFather = `node_If${this.nodeName}`;
        let ast = `${newFather}[label="If"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_If${this.nodeName}_1[label="Condition"]\n`;
        ast += `${newFather} -> node_If${this.nodeName}_1\n`;
        ast += this.condition.ast(`node_If${this.nodeName}_1`);
        for (let i of this.instructions) {
            ast += i.ast(newFather);
        }
        if (this.elseIf) {
            ast += `node_If${this.nodeName}_2[label="Else"]\n`;
            ast += `${newFather} -> node_If${this.nodeName}_2\n`;
            if (this.instructionsElse) {
                // for (let i of this.instructionsElse) {
                //     ast += i.ast(`node_If${this.nodeName}_2`);
                // }
            }
        }
        return ast;
    }
}
exports.default = If;
