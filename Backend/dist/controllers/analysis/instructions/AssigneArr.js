"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const TypeD_1 = __importDefault(require("../symbols/TypeD"));
class AssigneArr extends __1.Instruction {
    constructor(id, value, row, column) {
        super(new TypeD_1.default(__1.typeData.VOID), row, column);
        this.id = id;
        this.value = value;
    }
    interpret(tree, table) {
        console.log('ASSIGNEARR', this.value);
    }
}
exports.default = AssigneArr;
