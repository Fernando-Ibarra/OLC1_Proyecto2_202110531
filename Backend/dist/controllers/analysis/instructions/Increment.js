"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Errors_1 = __importDefault(require("../exceptions/Errors"));
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class Increment extends __1.Instruction {
    constructor(id, line, column) {
        super(new TypeD_1.default(__1.typeData.VOID), line, column);
        this.id = id[0];
        this.nodeName = `Increment${this.row}_${this.column}`;
    }
    interpret(tree, table) {
        let value = table.getVariable(this.id.toLocaleLowerCase());
        if (value == null)
            return new Errors_1.default('Semantico', `La variable ${this.id} no existe`, this.row, this.column);
        if (value.getType().getTypeData() != __1.typeData.INT) {
            return new Errors_1.default('Semantico', `No se puede decrementar la variable ${this.id} porque no es de tipo number`, this.row, this.column);
        }
        this.typeData = value.getType();
        value.setValue(parseInt(value.getValue()) + 1);
    }
    ast(fatherNode) {
        let ast = `node_${this.nodeName}[label="Increment"]\n`;
        ast += `${fatherNode} -> node_${this.nodeName}\n`;
        return ast;
    }
}
exports.default = Increment;
