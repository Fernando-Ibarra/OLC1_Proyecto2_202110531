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
const Functions_1 = __importDefault(require("./Functions"));
const Method_1 = __importDefault(require("./Method"));
const Return_1 = __importDefault(require("./Return"));
class Call extends __1.Instruction {
    constructor(id, row, column, params) {
        super(new TypeD_1.default(TypeD_1.typeData.VOID), row, column);
        this.id = id;
        this.params = params;
        this.nameNode = `${row}_${column}`;
    }
    interpret(tree, table) {
        let seek = tree.getFunction(this.id);
        if (seek == null) {
            return new Errors_1.default('Semantico', `No existe la funcion`, this.row, this.column);
        }
        if (seek instanceof Method_1.default) {
            let newTable = new __1.SymbolTable(tree.getGlobalTable());
            newTable.setName("Llamada a método " + this.id);
            if (seek.params.length != this.params.length) {
                return new Errors_1.default('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column);
            }
            for (let i = 0; i < seek.params.length; i++) {
                let param = new Declaration_1.default(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id]);
                let result = param.interpret(tree, newTable);
                if (result instanceof Errors_1.default)
                    return result;
                let value = this.params[i].interpret(tree, table);
                if (value instanceof Errors_1.default)
                    return value;
                let updateVar = newTable.getVariable(seek.params[i].id);
                if (updateVar == null) {
                    return new Errors_1.default('Semantico', `No existe la variable ${seek.params[i].id}`, this.row, this.column);
                }
                if (updateVar.getType().getTypeData() != this.params[i].typeData.getTypeData()) {
                    return new Errors_1.default('Semantico', `El tipo de dato no coincide con el parametro`, this.row, this.column);
                }
                updateVar.setValue(value);
            }
            let result = seek.interpret(tree, newTable);
            if (result instanceof Errors_1.default)
                return result;
        }
        if (seek instanceof Functions_1.default) {
            let newTable = new __1.SymbolTable(tree.getGlobalTable());
            newTable.setName("Llamada a Funcion " + this.id);
            if (seek.params.length != this.params.length) {
                return new Errors_1.default('Semantico', `La cantidad de parametros no coincide con la funcion`, this.row, this.column);
            }
            for (let i = 0; i < seek.params.length; i++) {
                let param = new Declaration_1.default(seek.params[i].typeDa, this.row, this.column, [seek.params[i].id]);
                let result = param.interpret(tree, newTable);
                if (result instanceof Errors_1.default)
                    return result;
                let value = this.params[i].interpret(tree, table);
                if (value instanceof Errors_1.default)
                    return value;
                let updateVar = newTable.getVariable(seek.params[i].id);
                if (updateVar == null) {
                    return new Errors_1.default('Semantico', `No existe la variable ${seek.params[i].id}`, this.row, this.column);
                }
                updateVar.setValue(value);
                console.log(`VAR UPDATE ${updateVar.getId()} VALUE: `, updateVar.getValue());
            }
            let result = seek.interpret(tree, newTable);
            this.typeData = seek.typeData;
            if (result instanceof Return_1.default) {
                return result;
            }
            if (result instanceof Errors_1.default)
                return result;
            return result;
        }
    }
    ast(fatherNode) {
        // HEAD
        let newFather = `node_Call${this.nameNode}`;
        let ast = `${newFather}[label="CALL INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        // CALL
        ast += `node_Call${this.nameNode}_CALL [label="${this.id}"]\n`;
        ast += `node_Call${this.nameNode}_LP [label="("]\n`;
        ast += `node_Call${this.nameNode}_PARM [label="PARAMS"]\n`;
        ast += `node_Call${this.nameNode}_RP [label=")"]\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_CALL\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_LP\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_PARM\n`;
        ast += `${newFather} -> node_Call${this.nameNode}_RP\n`;
        if (this.params.length > 0) {
            for (let i of this.params) {
                ast += i.ast(`node_Call${this.nameNode}_PARM`);
            }
        }
        return ast;
    }
}
exports.default = Call;
