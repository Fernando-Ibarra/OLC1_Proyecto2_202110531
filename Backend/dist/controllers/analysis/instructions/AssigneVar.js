"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class AssigneVar extends __1.Instruction {
    constructor(id, line, column, exp) {
        super(new TypeD_1.default(__1.typeData.VOID), line, column);
        if (!exp) {
            this.id = id;
        }
        else {
            this.id = id;
            this.expression = exp;
        }
        this.nodeName = `${line}_${column}`;
    }
    interpret(tree, table) {
        for (let i = 0; i < this.id.length; i++) {
            let id = this.id[i];
            if (!this.expression) {
                let value = table.getVariable(id.toLocaleLowerCase());
                if (value == null)
                    return new Errors_1.default('Semantico', `La variable ${this.id} no existe`, this.row, this.column);
                this.typeData = value.getType();
            }
            else {
                let NewValue = this.expression.interpret(tree, table);
                if (NewValue instanceof Errors_1.default)
                    return NewValue;
                let value = table.getVariable(id.toLocaleLowerCase());
                if (value == null)
                    return new Errors_1.default('Semantico', `La variable ${this.id} no existe`, this.row, this.column);
                if (this.expression.typeData.getTypeData() != value.getType().getTypeData()) {
                    return new Errors_1.default('Semantico', `No se puede asignar el tipo ${this.expression.typeData.getTypeData()} a ${value.getType().getTypeData()}`, this.row, this.column);
                }
                this.typeData = value.getType();
                value.setValue(NewValue);
            }
        }
    }
    ast(fatherNode) {
        let newFather = `node_ASSIGN${this.nodeName}`;
        let ast = `${newFather}[label="ASSIGN INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_ASSIGN${this.nodeName}_ID [label="ID"]\n`;
        ast += `node_ASSIGN${this.nodeName}_EQ [label="="]\n`;
        ast += `node_ASSIGN${this.nodeName}_VALUE [label="VALUE"]\n`;
        ast += `node_ASSIGN${this.nodeName}_SC [label=";"]\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_TYPE\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_EQ\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_VALUE\n`;
        ast += `${newFather} -> node_ASSIGN${this.nodeName}_SC\n`;
        for (let i of this.id) {
            ast += `node_ASSIGN${this.nodeName}_ID${i} [label="${i}"]\n`;
            ast += `node_ASSIGN${this.nodeName}_ID -> node_ASSIGN${this.nodeName}_ID${i}\n`;
        }
        if (this.expression) {
            ast += this.expression.ast(`node_ASSIGN${this.nodeName}_VALUE`);
        }
        return ast;
    }
}
exports.default = AssigneVar;
