"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = require("../symbols/TypeD");
const Return_1 = __importDefault(require("./Return"));
class Functions extends __1.Instruction {
    constructor(id, tipoV, instructions, row, column, params) {
        super(tipoV, row, column);
        this.id = id[0];
        this.params = params;
        this.instructions = instructions;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        for (let i of this.instructions) {
            console.log("FUNCTIONS: ", i);
            if (i instanceof Return_1.default) {
                console.log("FUNCTION - IF", i);
                return i;
            }
            let result = i.interpret(tree, table);
            if (result instanceof Errors_1.default)
                return result;
            if (result instanceof Return_1.default) {
                let resultCall = result.interpret(tree, table);
                return resultCall;
            }
            ;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Function${this.nodeName}`;
        let ast = `${newFather}[label="FUNCTION INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Function${this.nodeName}_MT [label="${this.getTypeString(this.typeData.getTypeData())}"]\n`;
        ast += `node_Function${this.nodeName}_ID[label="ID"]\n`;
        ast += `node_Function${this.nodeName}_LP[label="("]\n`;
        ast += `node_Function${this.nodeName}_PARM[label="PARAMS"]\n`;
        ast += `node_Function${this.nodeName}_RP[label=")"]\n`;
        ast += `node_Function${this.nodeName}_LB[label="{"]\n`;
        ast += `node_Function${this.nodeName}_INSTRUCTIONS [label="INSTRUCTIONS"]\n`;
        ast += `node_Function${this.nodeName}_RB[label="}"]\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_MT\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_LP\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_PARM\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_RP\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_LB\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_INSTRUCTIONS\n`;
        ast += `${newFather} -> node_Function${this.nodeName}_RB\n`;
        ast += `node_Function${this.nodeName}_ID_NAME [label="${this.id}"]\n`;
        ast += `node_Function${this.nodeName}_ID -> node_Function${this.nodeName}_ID_NAME\n`;
        for (let i of this.instructions) {
            ast += i.ast(`node_Function${this.nodeName}_INSTRUCTIONS`);
        }
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
exports.default = Functions;
