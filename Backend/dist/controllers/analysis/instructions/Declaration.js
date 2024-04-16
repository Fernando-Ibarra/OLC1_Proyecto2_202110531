"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
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
                    return new __1.Error('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
                return;
            }
            else {
                let NewValue = this.value.interpret(tree, table);
                if (NewValue instanceof __1.Error)
                    return NewValue;
                if (this.value.typeData.getTypeData() != this.typeData.getTypeData()) {
                    return new __1.Error('Semantico', `No se puede asignar el tipo ${this.value.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column);
                }
                if (!table.setVariable(new __1.Symbol(this.typeData, id, NewValue))) {
                    return new __1.Error('Semantico', `La variable ${id} ya existe`, this.row, this.column);
                }
            }
        }
    }
    ast(fatherNode) {
        return "";
    }
}
exports.default = Declaration;
