"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Nativo extends __1.Instruction {
    constructor(type, value, line, column) {
        super(type, line, column);
        this.value = value;
        this.nameNode = `Nativo${line}_${column}`;
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
    ast(fatherNode) {
        let ast = `node${this.nameNode}[label="${this.value}"]\n`;
        ast += `${fatherNode} -> node${this.nameNode}\n`;
        return ast;
    }
}
exports.default = Nativo;
