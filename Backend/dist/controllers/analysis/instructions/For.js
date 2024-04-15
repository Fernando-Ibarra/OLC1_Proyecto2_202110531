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
const Continue_1 = __importDefault(require("./Continue"));
const Return_1 = __importDefault(require("./Return"));
class For extends __1.Instruction {
    constructor(declaration, condition, increment, instructions, row, column) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.declaration = declaration;
        this.condition = condition;
        this.increment = increment;
        this.instructions = instructions;
    }
    interpret(tree, table) {
        let newTable = new __1.SymbolTable(table);
        let dec = this.declaration.interpret(tree, newTable);
        if (dec instanceof __1.Error)
            return dec;
        let cond = this.condition.interpret(tree, newTable);
        if (cond instanceof __1.Error)
            return cond;
        if (this.condition.typeData.getTypeData() != TypeD_1.typeData.BOOL) {
            return new __1.Error("Semántico", "Se esperaba una expresión booleana en la condición del for", this.row, this.column);
        }
        let conditionValue = this.condition.interpret(tree, newTable);
        while (conditionValue == true) {
            for (let i of this.instructions) {
                console.log(i);
                if (i instanceof Break_1.default)
                    return;
                let result = i.interpret(tree, newTable);
                console.log(result);
                if (result instanceof Break_1.default) {
                    return;
                }
                if (result instanceof Continue_1.default) {
                    break;
                }
                if (result instanceof __1.Error) {
                    return;
                }
                if (result instanceof Return_1.default) {
                    return result;
                }
            }
            let inc = this.increment.interpret(tree, newTable);
            if (inc instanceof __1.Error)
                return inc;
            conditionValue = this.condition.interpret(tree, newTable);
        }
    }
}
exports.default = For;
