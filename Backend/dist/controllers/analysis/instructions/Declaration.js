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
    }
    interpret(tree, table) {
        for (let i = 0; i < this.id.length; i++) {
            let id = this.id[i];
            if (this.value) {
                let NewValue = this.value.interpret(tree, table);
                if (NewValue instanceof Errors_1.default)
                    return NewValue;
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new Errors_1.default('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
                }
                if (!table.setVariable(new __1.Symbol(this.typeData, id, NewValue))) {
                    return new Errors_1.default('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
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
        let ast = 'node' + this.row + '_' + this.column + '[label="\\<Instruccion\\>\\nDeclaracion"];\n';
        ast += fatherNode + ' -> node' + this.row + '_' + this.column + ';\n';
        if (this.value) {
            ast += 'node' + this.row + '_' + this.column + ' -> node' + this.value.row + '_' + this.value.column + ';\n';
            ast += this.value.ast('node' + this.row + '_' + this.column);
        }
        return ast;
    }
}
exports.default = Declaration;
