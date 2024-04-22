"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = require("../symbols/TypeD");
class Declaration extends __1.Instruction {
    constructor(typeV, row, column, id, value) {
        super(typeV, row, column);
        if (!value) {
            this.id = id;
        }
        else {
            this.id = id;
            this.value = value;
        }
        this.nodeName = `${row}_${column}`;
    }
    interpret(tree, table) {
        for (let i = 0; i < this.id.length; i++) {
            let id = this.id[i];
            if (this.value) {
                console.log(`id: ${id} value: ${this.value}`);
                let NewValue = this.value.interpret(tree, table);
                console.log(`id: ${id} newValue: ${NewValue}`);
                if (NewValue instanceof Errors_1.default)
                    return NewValue;
                console.log(`id: ${id} valueCon1: ${NewValue}`);
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new Errors_1.default('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
                }
                console.log(`id: ${id} valueCon2: ${NewValue}`);
                if (!table.setVariable(new __1.Symbol(this.typeData, id, NewValue))) {
                    return new Errors_1.default('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
                console.log(`id: ${id} valueInter: ${NewValue}`);
            }
            else {
                if (!table.setVariable(new __1.Symbol(this.typeData, id, this.defaultValues(this.typeData.getTypeData())))) {
                    return new Errors_1.default('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
            }
        }
    }
    defaultValues(typeV) {
        switch (typeV) {
            case TypeD_1.typeData.INT:
                return 0;
            case TypeD_1.typeData.FLOAT:
                return 0.0;
            case TypeD_1.typeData.CHAR:
                return '';
            case TypeD_1.typeData.BOOL:
                return true;
        }
    }
    ast(fatherNode) {
        let newFather = `node_Declaration${this.nodeName}`;
        let ast = `${newFather}[label="DECLARATION INSTRUCTION"]\n`;
        ast += `${fatherNode} -> ${newFather}\n`;
        ast += `node_Declaration${this.nodeName}_TYPE [label="TYPE"]\n`;
        ast += `node_Declaration${this.nodeName}_ID [label="ID"]\n`;
        ast += `node_Declaration${this.nodeName}_EQ [label="="]\n`;
        ast += `node_Declaration${this.nodeName}_VALUE [label="VALUE"]\n`;
        ast += `node_Declaration${this.nodeName}_SC [label=";"]\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_TYPE\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_ID\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_EQ\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_VALUE\n`;
        ast += `${newFather} -> node_Declaration${this.nodeName}_SC\n`;
        for (let i of this.id) {
            ast += `node_Declaration${this.nodeName}_ID${i} [label="${i}"]\n`;
            ast += `node_Declaration${this.nodeName}_ID -> node_Declaration${this.nodeName}_ID${i}\n`;
        }
        ast += `node_Declaration${this.nodeName}_TYPE${this.typeData.getTypeData()} [label="${this.getTypeString(this.typeData.getTypeData())}"]\n`;
        ast += `node_Declaration${this.nodeName}_TYPE -> node_Declaration${this.nodeName}_TYPE${this.typeData.getTypeData()}\n`;
        if (this.value) {
            ast += this.value.ast(`node_Declaration${this.nodeName}_VALUE`);
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
exports.default = Declaration;
