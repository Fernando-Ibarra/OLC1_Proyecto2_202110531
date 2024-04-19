"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
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
            if (!this.value) {
                if (!table.setVariable(new __1.Symbol(this.typeData, id, null))) {
                    return new Errors_1.default('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
                return;
            }
            else {
                console.log("DECLARATION VALUE Be", this.value);
                let NewValue = this.value.interpret(tree, table);
                console.log("DECLARATION VALUE Af", NewValue);
                if (NewValue instanceof Errors_1.default)
                    return NewValue;
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new Errors_1.default('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
                }
                if (!table.setVariable(new __1.Symbol(this.typeData, id, NewValue))) {
                    return new Errors_1.default('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
                console.log("TABLE DECLA", table);
            }
        }
    }
    ast(fatherNode) {
        return "";
    }
}
exports.default = Declaration;
