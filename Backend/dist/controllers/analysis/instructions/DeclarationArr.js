"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
class DeclarationArr extends __1.Instruction {
    constructor(typeV, id, value, row, column) {
        super(typeV, row, column);
        this.valueArr = [];
        this.id = id;
        this.value = value;
    }
    interpret(tree, table) {
        console.log('DECLARATIONARR', this.value[0].length);
        // this.valueArr = this.value.map(
        //     (arr) => arr.map(
        //         (val) => {
        //             let value = val.interpret(tree, table)
        //             if (value instanceof Error) return value
        //             return value
        //         }
        //     )
        // )
        // let id = this.id[0]
        // if (!table.setVariable(new Symbol(this.typeData, id, this.valueArr))) {
        //     return new Error('Semantico', `La variable ${id} ya existe`, this.row, this.column)
        // }
    }
}
exports.default = DeclarationArr;
