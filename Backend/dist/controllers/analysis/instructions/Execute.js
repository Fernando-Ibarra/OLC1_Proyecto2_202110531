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
class Execute extends __1.Instruction {
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
            let newTable = new __1.SymbolTable(tree.getGlobalTable());
            newTable.setName("Execute");
            if (seek.params.length != this.params.length) {
                return new Errors_1.default('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column);
            }
            for (let i = 0; i < seek.params.length; i++) {
                let paramDeclared = new Declaration_1.default(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id], this.params[i]);
                let result = paramDeclared.interpret(tree, newTable);
                if (result instanceof Errors_1.default)
                    return result;
            }
            let result = seek.interpret(tree, newTable);
            if (result instanceof Errors_1.default)
                return result;
        }
    }
    ast(father) {
        let ast = "node0 [label=\"EXEC\"];\n";
        ast += "node1 [label=\"INSTRUCTIONS\"];\n";
        ast += "node0 -> node1;\n";
        for (let i of this.params) {
            ast += i.ast("node1");
        }
        return ast;
    }
}
exports.default = Execute;
