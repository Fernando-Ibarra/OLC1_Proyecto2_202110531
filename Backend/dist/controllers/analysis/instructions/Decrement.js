"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Decrement extends __1.Instruction {
    constructor(id, line, column) {
        super(new TypeD_1.default(__1.typeData.VOID), line, column);
        this.id = id[0];
        this.nodeName = `${this.row}_${this.column}`;
    }
    interpret(tree, table) {
        let value = table.getVariable(this.id.toLocaleLowerCase());
        if (value == null)
            return new Errors_1.default('Semantico', `La variable ${this.id} no existe`, this.row, this.column);
        if (value.getType().getTypeData() != __1.typeData.INT) {
            return new Errors_1.default('Semantico', `No se puede decrementar la variable ${this.id} porque no es de tipo number`, this.row, this.column);
        }
        this.typeData = value.getType();
        value.setValue(parseInt(value.getValue()) - 1);
    }
    ast(fatherNode) {
        let newFather = `node_DECREMENT${this.nodeName}`;
        let ast = `${newFather}[label="DECREMENT INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_DECREMENT${this.nodeName}_ID [label="${this.id}"]\n`;
        ast += `node_DECREMENT${this.nodeName}_MINUS1 [label="-"]\n`;
        ast += `node_DECREMENT${this.nodeName}_MINUS2 [label="-"]\n`;
        ast += `node_DECREMENT${this.nodeName}_SC [label=";"]\n`;
        ast += `${newFather} -> node_DECREMENT${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_DECREMENT${this.nodeName}_MINUS1\n`;
        ast += `${newFather} -> node_DECREMENT${this.nodeName}_MINUS2\n`;
        ast += `${newFather} -> node_DECREMENT${this.nodeName}_SC\n`;
        return ast;
    }
}
exports.default = Decrement;
