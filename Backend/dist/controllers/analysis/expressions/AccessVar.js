"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class AccessVar extends __1.Instruction {
    constructor(id, row, column) {
        super(new TypeD_1.default(__1.typeData.VOID), row, column);
        this.id = id;
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        let valueVar = table.getVariable(this.id);
        if (valueVar == null) {
            return new Errors_1.default('Semantico', `Acceso invalido`, this.row, this.column);
        }
        this.typeData = valueVar.getType();
        return valueVar.getValue();
    }
    ast(fatherNode) {
        let nodeVar = `node_Var${this.nodeName}`;
        let ast = `${nodeVar}[label="${this.id}"]\n`;
        ast += `${fatherNode} -> ${nodeVar}\n`;
        return ast;
    }
}
exports.default = AccessVar;
