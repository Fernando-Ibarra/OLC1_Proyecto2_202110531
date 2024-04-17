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
        return "";
    }
}
exports.default = AssigneVar;
