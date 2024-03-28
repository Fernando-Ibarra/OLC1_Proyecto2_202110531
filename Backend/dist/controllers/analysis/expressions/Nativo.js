"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Nativo extends __1.Instruction {
    constructor(type, value, line, column) {
        super(type, line, column);
        this.value = value;
    }
    interpret(tree, table) {
        if (this.typeData.getTypeData() == __1.typeData.BOOL) {
            return this.value == 'true' ? true : false;
        }
        if (this.typeData.getTypeData() == __1.typeData.STRING) {
            let val = this.value.toString();
            this.value = val.replace('\\n', '\n').replace('\\t', '\t').replace('\\r', '\r').replace('\\\\', '\\').replace("\\'", "'").replace('\\"', '"');
        }
        return this.value;
    }
}
exports.default = Nativo;
