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
class Casts extends __1.Instruction {
    constructor(newType, expression, row, column) {
        super(newType, row, column);
        this.expression = expression;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        let exp = this.expression.interpret(tree, table);
        if (exp instanceof Errors_1.default)
            return exp;
        if (exp == null)
            return new Errors_1.default('Semantico', `La variable ${exp} no existe`, this.row, this.column);
        switch (this.typeData.getTypeData()) {
            case TypeD_1.typeData.INT:
                return this.intCasts(exp);
            case TypeD_1.typeData.FLOAT:
                return this.floatCasts(exp);
            case TypeD_1.typeData.CHAR:
                return this.charCasts(exp);
            default:
                return new Errors_1.default('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
        }
    }
    intCasts(exp) {
        let typeExpression = this.expression.typeData.getTypeData();
        switch (typeExpression) {
            case TypeD_1.typeData.FLOAT:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.INT);
                return parseInt(exp);
            case TypeD_1.typeData.CHAR:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.INT);
                return parseInt(exp);
            case TypeD_1.typeData.STRING:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.INT);
                return parseInt(exp);
            default:
                return new Errors_1.default('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
        }
    }
    floatCasts(exp) {
        let typeExpression = this.expression.typeData.getTypeData();
        switch (typeExpression) {
            case TypeD_1.typeData.INT:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.FLOAT);
                return parseFloat(exp);
            case TypeD_1.typeData.STRING:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.FLOAT);
                exp = parseFloat(exp + 0.00);
            default:
                return new Errors_1.default('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
        }
    }
    charCasts(exp) {
        let typeExpression = this.expression.typeData.getTypeData();
        switch (typeExpression) {
            case TypeD_1.typeData.INT:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.CHAR);
                return String.fromCharCode(exp);
            case TypeD_1.typeData.FLOAT:
                this.typeData = new TypeD_1.default(TypeD_1.typeData.CHAR);
                return String.fromCharCode(exp);
            default:
                return new Errors_1.default('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
        }
    }
    ast(fatherNode) {
        let newFather = `node_Casts${this.nodeName}`;
        let ast = `${newFather}[label="CASTS INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Casts${this.nodeName}_LP[label="("]\n`;
        ast += `node_Casts${this.nodeName}_TYPE [label="TYPE"]\n`;
        ast += `node_Casts${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Casts${this.nodeName}_EXPRESION [label="EXPRESION"]\n`;
        ast += `${newFather} -> node_Casts${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Casts${this.nodeName}_EXPRESION\n`;
        ast += `${newFather} -> node_Casts${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Casts${this.nodeName}_EXPRESION\n`;
        ast += this.expression.ast(`node_Casts${this.nodeName}_EXPRESION`);
        ast += `node_Casts${this.nodeName}_TYPE_NAME [label="${this.getTypeString(this.typeData.getTypeData())}"]\n`;
        ast += `node_Casts${this.nodeName}_TYPE -> node_Casts${this.nodeName}_TYPE_NAME\n`;
        return ast;
    }
    getTypeString(tpd) {
        if (tpd == TypeD_1.typeData.BOOL) {
            return "bool";
        }
        else if (tpd == TypeD_1.typeData.CHAR) {
            return "char";
        }
        else if (tpd == TypeD_1.typeData.FLOAT) {
            return "double";
        }
        else if (tpd == TypeD_1.typeData.STRING) {
            return "std::string";
        }
        else if (tpd == TypeD_1.typeData.INT) {
            return "int";
        }
        else {
            return "void";
        }
    }
}
exports.default = Casts;
