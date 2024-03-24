"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativo = void 0;
const __1 = require("..");
class Nativo extends __1.Instruction {
    constructor(type, value, line, column) {
        super(type, line, column);
        this.value = value;
    }
    interpret(tree, table) {
        return this.value;
    }
}
exports.Nativo = Nativo;
