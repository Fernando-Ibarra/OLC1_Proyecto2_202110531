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
const Declaration_1 = __importDefault(require("./Declaration"));
const Method_1 = __importDefault(require("./Method"));
class Call extends __1.Instruction {
    constructor(id, row, column, params) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.id = id[0];
        this.params = params;
    }
    interpret(tree, table) {
        let seek = tree.getFunction(this.id);
        if (seek == null) {
            return new Errors_1.default('Semantico', `No existe la funcion`, this.row, this.column);
        }
        if (seek instanceof Method_1.default) {
            let newTable = new __1.SymbolTable(table);
            newTable.setName("Llamada a método " + this.id);
            if (seek.params.length != this.params.length) {
                return new Errors_1.default('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column);
            }
            for (let i = 0; i < seek.params.length; i++) {
                console.log("i CALL", i);
                console.log("SEEK", seek.params[i].id);
                console.log("PARAMS", this.params[i]);
                let param = new Declaration_1.default(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id], this.params[i]);
                console.log("param CALL", param);
                let result = param.interpret(tree, newTable);
                console.log("result CALL", result);
                if (result instanceof Errors_1.default)
                    return result;
            }
            let result = seek.interpret(tree, newTable);
            if (result instanceof Errors_1.default)
                return result;
        }
    }
    ast(fatherNode) {
        let ast = `node_${this.row}_${this.column}[label="Call"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}\n`;
        ast += `node_${this.row}_${this.column}_1[label="id: ${this.id}"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}_1\n`;
        ast += `node_${this.row}_${this.column}_2[label="params"]\n`;
        ast += `${fatherNode} -> node_${this.row}_${this.column}_2\n`;
        for (let i of this.params) {
            ast += i.ast(`node_${this.row}_${this.column}_2`);
        }
        return ast;
    }
}
exports.default = Call;
