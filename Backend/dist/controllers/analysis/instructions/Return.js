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
const Call_1 = __importDefault(require("./Call"));
class Return extends __1.Instruction {
    constructor(row, column, expression) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.expression = expression;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        if (this.expression) {
            let result = this.expression.interpret(tree, table);
            if (result instanceof Error)
                return result;
            if (result instanceof Call_1.default) {
                let valueCall = result.interpret(tree, table);
                if (valueCall instanceof Error)
                    return valueCall;
                return valueCall;
            }
            return result;
        }
        else {
            return;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Return${this.nodeName}`;
        let ast = `${newFather}[label="RETURN INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Return${this.nodeName}_SC [label=";"]\n`;
        if (this.expression) {
            ast += this.expression.ast(newFather);
        }
        ast += `${fatherNode} -> node_Return${this.nodeName}_SC\n`;
        return ast;
    }
}
exports.default = Return;
