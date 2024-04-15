"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Increment extends __1.Instruction {
    constructor(id, line, column) {
        super(new TypeD_1.default(__1.typeData.VOID), line, column);
        this.id = id[0];
    }
    interpret(tree, table) {
        let value = table.getVariable(this.id.toLocaleLowerCase());
        if (value == null)
            return new __1.Error('Semantico', `La variable ${this.id} no existe`, this.row, this.column);
        if (value.getType().getTypeData() != __1.typeData.INT) {
            return new __1.Error('Semantico', `No se puede decrementar la variable ${this.id} porque no es de tipo number`, this.row, this.column);
        }
        this.typeData = value.getType();
        value.setValue(parseInt(value.getValue()) + 1);
    }
}
exports.default = Increment;
